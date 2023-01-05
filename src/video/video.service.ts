import { Injectable } from '@nestjs/common';
import { CreateVideoInput } from './dto/create-video.input';
import { UpdateVideoInput } from './dto/update-video.input';
import { BaseService } from '@common/services/base.service';
import { VideoEntity } from './entities/video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoService extends BaseService<
  VideoEntity,
  CreateVideoInput,
  UpdateVideoInput
> {
  constructor(private readonly videoRepository: Repository<VideoEntity>) {
    super(videoRepository);
  }
}
