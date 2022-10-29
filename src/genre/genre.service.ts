import { Injectable } from '@nestjs/common';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreEntity } from './entities/genre.entity';
import { In, Repository } from 'typeorm';
import { PaginatedGenres } from './dto/paginated-genres';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { GqlOffsetPagination } from '../common/pagination';
import { SortType } from '../common/sort';
import { FilterType } from '../common/filter';
import { parseArgs } from '../common/typeorm-query-parser';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  create = async (createGenreInput: CreateGenreInput): Promise<GenreEntity> =>
    this.genreRepository.save(createGenreInput);

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<GenreEntity>,
    filter?: FilterType<GenreEntity>,
  ): Promise<PaginatedGenres> => {
    const qb = parseArgs(
      this.genreRepository.createQueryBuilder(),
      pagination,
      sort,
      filter,
    );

    const [data, count] = await qb.getManyAndCount();
    return { data, count, hasNext: count > pagination.take + pagination.skip };
  };

  readManyByIds = async (ids: string[]): Promise<GenreEntity[]> =>
    await this.genreRepository.findBy({ id: In(ids) });

  async readOne(id: string): Promise<GenreEntity> {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundError(`Genre with id "${id}" not found!`);
    }
    return genre;
  }

  update = async (
    id: string,
    updateGenreInput: UpdateGenreInput,
  ): Promise<GenreEntity> => {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundError(`Genre with id "${id}" not found!`);
    }
    return this.genreRepository.save({
      ...genre,
      ...updateGenreInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundError(`Genre with id "${id}" not found!`);
    }
    await this.genreRepository.remove(genre);
    return true;
  };
}
