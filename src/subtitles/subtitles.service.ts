import { Injectable } from '@nestjs/common';
import { CreateSubtitlesInput } from './dto/create-subtitles.input';
import { UpdateSubtitlesInput } from './dto/update-subtitles.input';
import { BaseService } from '@common/services';
import { SubtitlesEntity } from './entities/subtitles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubtitlesService extends BaseService<
  SubtitlesEntity,
  CreateSubtitlesInput,
  UpdateSubtitlesInput
> {
  constructor(
    @InjectRepository(SubtitlesEntity)
    private readonly subtitlesRepository: Repository<SubtitlesEntity>,
  ) {
    super(subtitlesRepository);
  }
}
