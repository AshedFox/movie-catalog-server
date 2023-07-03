import { Injectable } from '@nestjs/common';
import { BaseService } from '@common/services';
import { VideoAudioEntity } from './entities/video-audio.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { MediaEntity } from '../media/entities/media.entity';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import fs from 'fs';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { AudioProfileEnum } from '@utils/enums/audio-profile.enum';
import { GoogleCloudService } from '../cloud/google-cloud.service';
import { FormatEnum } from '@utils/enums/format.enum';

@Injectable()
export class VideoAudioService extends BaseService<
  VideoAudioEntity,
  DeepPartial<VideoAudioEntity>,
  DeepPartial<VideoAudioEntity>
> {
  constructor(
    @InjectRepository(VideoAudioEntity)
    private readonly videoAudioRepository: Repository<VideoAudioEntity>,
    private readonly ffmpegService: FfmpegService,
    private readonly cloudService: GoogleCloudService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(videoAudioRepository);
  }

  makeForProfile = async (
    videoId: number,
    profile: AudioProfileEnum,
    languageId: string,
    inputPath: string,
    outputDir: string,
    name: string,
    format: FormatEnum,
  ): Promise<void> => {
    const outputPath = join(outputDir, `${name}.${format.toLowerCase()}`);

    await this.ffmpegService.makeAudio(
      inputPath,
      outputPath,
      profile,
      format,
      languageId,
    );

    const uploadUrl = await this.cloudService.upload(
      outputPath,
      `videos/video_${videoId}/${name}.${format.toLowerCase()}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const media = await queryRunner.manager.save(MediaEntity, {
        type: MediaTypeEnum.RAW,
        url: uploadUrl,
      });

      const existing = await queryRunner.manager.findOneBy(VideoAudioEntity, {
        videoId,
        languageId,
        profile,
        format,
      });

      if (!existing) {
        await queryRunner.manager.save(VideoAudioEntity, {
          videoId,
          languageId,
          profile,
          format,
          mediaId: media.id,
        });
      } else {
        await queryRunner.manager.save(VideoAudioEntity, {
          ...existing,
          mediaId: media.id,
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
      fs.rmSync(outputPath);
    }
  };
}
