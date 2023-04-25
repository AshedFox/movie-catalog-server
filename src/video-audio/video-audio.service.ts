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
    format: string,
  ): Promise<void> => {
    const outputPath = join(outputDir, `${name}.${format}`);

    await this.ffmpegService.makeAudio(
      inputPath,
      outputPath,
      profile,
      languageId,
    );

    const uploadUrl = await this.cloudService.upload(
      outputPath,
      `videos/audio_${videoId}/${name}.${format}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const media = await queryRunner.manager.save(MediaEntity, {
        type: MediaTypeEnum.RAW,
        url: uploadUrl,
      });

      await queryRunner.manager.save(VideoAudioEntity, {
        videoId,
        languageId,
        profile,
        mediaId: media.id,
      });

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
