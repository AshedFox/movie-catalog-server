import { Injectable } from '@nestjs/common';
import { VideoEntity } from './entities/video.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services';

@Injectable()
export class VideoService extends BaseService<
  VideoEntity,
  Partial<VideoEntity>,
  Partial<VideoEntity>
> {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {
    super(videoRepository);
  }
}
