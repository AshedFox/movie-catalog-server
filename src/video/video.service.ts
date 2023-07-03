import { Injectable, Logger } from '@nestjs/common';
import { VideoEntity } from './entities/video.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services';
import { join } from 'path';
import fs from 'fs';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { VideoVariantEntity } from '../video-variant/entities/video-variant.entity';
import { VideoAudioEntity } from '../video-audio/entities/video-audio.entity';
import { SubtitlesEntity } from '../subtitles/entities/subtitles.entity';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { GoogleCloudService } from '../cloud/google-cloud.service';
import { MediaService } from '../media/media.service';

@Injectable()
export class VideoService extends BaseService<
  VideoEntity,
  Partial<VideoEntity>,
  Partial<VideoEntity>
> {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly ffmpegService: FfmpegService,
    private readonly cloudService: GoogleCloudService,
    private readonly mediaService: MediaService,
  ) {
    super(videoRepository);
  }

  prepareStreamingData = async (
    id: number,
  ): Promise<{
    videoVariants: VideoVariantEntity[];
    audioVariants: VideoAudioEntity[];
    subtitles: SubtitlesEntity[];
  }> => {
    const videoVariants = await this.dataSource
      .createQueryBuilder(VideoVariantEntity, 'vv')
      .innerJoinAndSelect('vv.media', 'm', 'm.id = vv.media_id')
      .where('video_id = :id', { id })
      .getMany();
    const audioVariants = await this.dataSource
      .createQueryBuilder(VideoAudioEntity, 'av')
      .innerJoinAndSelect('av.media', 'm', 'm.id = av.media_id')
      .where('video_id = :id', { id })
      .getMany();
    const subtitles = await this.dataSource
      .createQueryBuilder(SubtitlesEntity, 's')
      .innerJoinAndSelect('s.file', 'm', 'm.id = s.file_id')
      .where('video_id = :id', { id })
      .getMany();

    if (audioVariants.length === 0) {
      throw new Error(
        `Cannot generate streaming files for video ${id}, no audio variants.`,
      );
    } else if (videoVariants.length === 0) {
      throw new Error(
        `Cannot generate streaming files for video ${id}, no video variants.`,
      );
    }

    Logger.log(videoVariants, audioVariants, subtitles);

    return {
      videoVariants,
      audioVariants,
      subtitles,
    };
  };

  createStreaming = async (
    id: number,
    streamingOutDir: string,
    videoVariants: VideoVariantEntity[],
    audioVariants: VideoAudioEntity[],
    subtitles: SubtitlesEntity[],
  ) => {
    try {
      fs.mkdirSync(streamingOutDir, { recursive: true });

      const manifestPath = `${streamingOutDir}//master.mpd`;

      await this.ffmpegService.makeDashManifest(
        {
          ENG: videoVariants.map((value) => value.media.url),
        },
        audioVariants.reduce((prev, curr) => {
          if (!prev[curr.languageId]) {
            prev[curr.languageId] = [];
          }
          prev[curr.languageId].push(curr.media.url);
          return prev;
        }, {}),
        subtitles.reduce((prev, curr) => {
          if (!prev[curr.languageId]) {
            prev[curr.languageId] = curr.file.url;
          }
          return prev;
        }, {}),
        manifestPath,
      );
    } catch (err) {
      Logger.error(err);
      throw new Error(`Failed to generate streaming for video ${id}`);
    }
  };

  clearStreamingFiles = async (id: number) => {
    const video = await this.videoRepository.findOneBy({
      id,
    });

    await this.videoRepository.save({
      ...video,
      dashManifestMediaId: null,
      hlsManifestMediaId: null,
    });

    await this.mediaService.deleteMany([
      video.dashManifestMediaId,
      video.hlsManifestMediaId,
    ]);

    await this.cloudService.delete(`videos/video_${id}/streaming`);
  };

  uploadStreamingFiles = async (id: number, streamingOutDir: string) => {
    try {
      const files = fs.readdirSync(streamingOutDir);

      for (const file of files) {
        const uploadUrl = await this.cloudService.upload(
          join(streamingOutDir, file),
          `videos/video_${id}/streaming/${file}`,
        );

        if (file === 'master.mpd') {
          const manifestMedia = await this.mediaService.create({
            type: MediaTypeEnum.RAW,
            url: uploadUrl,
          });

          await this.update(id, {
            dashManifestMediaId: manifestMedia.id,
          });
        } else if (file === 'master.m3u8') {
          const manifestMedia = await this.mediaService.create({
            type: MediaTypeEnum.RAW,
            url: uploadUrl,
          });

          await this.update(id, {
            hlsManifestMediaId: manifestMedia.id,
          });
        }
      }
    } catch (err) {
      throw new Error(`Failed to upload files for video ${id}`);
    }
  };
}
