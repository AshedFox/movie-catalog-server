import { Injectable } from '@nestjs/common';
import { MovieEntity } from './entities/movie.entity';
import { In, Repository } from 'typeorm';
import { PaginatedMovies } from './dto/paginated-movies';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<MovieEntity>,
    filter?: FilterType<MovieEntity>,
  ): Promise<PaginatedMovies> => {
    const qb = parseArgsToQuery(this.movieRepository, pagination, sort, filter);
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyMostPopular = async (
    pagination: GqlOffsetPagination,
  ): Promise<MovieEntity[]> => {
    const queryText = `
      SELECT * FROM public.get_most_popular_movies()
      LIMIT $1 OFFSET $2
    `;

    const data = (await this.movieRepository.query(queryText, [
      pagination.take,
      pagination.skip,
    ])) as MovieEntity[];

    return plainToInstance(MovieEntity, data);
  };

  readManyByIds = async (ids: string[]): Promise<MovieEntity[]> => {
    return this.movieRepository.findBy({ id: In(ids) });
  };

  readOne = async (id: string): Promise<MovieEntity> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id "${id}" not found!`);
    }
    return movie;
  };

  delete = async (id: string): Promise<boolean> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id ${id} not found!`);
    }
    await this.movieRepository.remove(movie);
    return true;
  };
}
