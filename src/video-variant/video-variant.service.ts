import { Injectable } from '@nestjs/common';
import { CreateVideoVariantInput } from './dto/create-video-variant.input';
import { In, Repository } from 'typeorm';
import { VideoVariantEntity } from './entities/video-variant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services';
import { UpdateVideoVariantInput } from './dto/update-video-variant.input';

@Injectable()
export class VideoVariantService extends BaseService<
  VideoVariantEntity,
  CreateVideoVariantInput,
  UpdateVideoVariantInput
> {
  constructor(
    @InjectRepository(VideoVariantEntity)
    private readonly videoVariantRepository: Repository<VideoVariantEntity>,
  ) {
    super(videoVariantRepository);
  }

  readManyByVideos = async (
    videosIds: number[],
  ): Promise<VideoVariantEntity[]> =>
    this.videoVariantRepository.findBy({
      videoId: In(videosIds),
    });
}
