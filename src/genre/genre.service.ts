import { Injectable } from '@nestjs/common';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreEntity } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class GenreService extends BaseService<
  GenreEntity,
  CreateGenreInput,
  UpdateGenreInput
> {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {
    super(genreRepository);
  }
}
