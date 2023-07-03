import { Injectable } from '@nestjs/common';
import { CreateVideoVariantInput } from './dto/create-video-variant.input';
import { DataSource, Repository } from 'typeorm';
import { VideoVariantEntity } from './entities/video-variant.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services';
import { UpdateVideoVariantInput } from './dto/update-video-variant.input';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import { join } from 'path';
import { MediaEntity } from '../media/entities/media.entity';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { GoogleCloudService } from '../cloud/google-cloud.service';
import fs from 'fs';
import { FormatEnum } from '@utils/enums/format.enum';

@Injectable()
export class VideoVariantService extends BaseService<
  VideoVariantEntity,
  CreateVideoVariantInput,
  UpdateVideoVariantInput
> {
  constructor(
    @InjectRepository(VideoVariantEntity)
    private readonly videoVariantRepository: Repository<VideoVariantEntity>,
    private readonly ffmpegService: FfmpegService,
    private readonly cloudService: GoogleCloudService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(videoVariantRepository);
  }

  makeForProfile = async (
    videoId: number,
    profile: VideoProfileEnum,
    inputPath: string,
    outputDir: string,
    name: string,
    format: FormatEnum,
  ): Promise<void> => {
    const outputPath = join(outputDir, `${name}.${format.toLowerCase()}`);

    await this.ffmpegService.makeVideo(inputPath, outputPath, profile, format);

    const uploadUrl = await this.cloudService.upload(
      outputPath,
      `videos/video_${videoId}/${name}.${format.toLowerCase()}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const media = await queryRunner.manager.save(MediaEntity, {
        type: MediaTypeEnum.VIDEO,
        url: uploadUrl,
      });

      const existing = await queryRunner.manager.findOneBy(VideoVariantEntity, {
        videoId,
        profile,
        format,
      });

      if (!existing) {
        await queryRunner.manager.save(VideoVariantEntity, {
          videoId,
          profile,
          format,
          mediaId: media.id,
        });
      } else {
        await queryRunner.manager.save(VideoVariantEntity, {
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
