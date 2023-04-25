import { Injectable } from '@nestjs/common';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { PaginatedMovies } from './dto/paginated-movies';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '@utils/errors';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { OffsetPaginationArgsType } from '@common/pagination/offset';
import { MovieVisitStatsLastMonthView } from '../movie-visit-stats/entities/movie-visit-stats-last-month.view';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  readMany = async (
    pagination?: OffsetPaginationArgsType,
    sort?: SortType<MovieEntity>,
    filter?: FilterType<MovieEntity>,
  ): Promise<PaginatedMovies> => {
    const qb = parseArgsToQuery(this.movieRepository, pagination, sort, filter);
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  };

  readManyMostViewed = async (
    pagination: OffsetPaginationArgsType,
  ): Promise<MovieEntity[]> => {
    return this.movieRepository
      .createQueryBuilder('m')
      .select()
      .leftJoin(
        (qb) => {
          return qb
            .select(
              '"mv"."movie_id" as movie_id, count("mv"."movie_id") as visits_count',
            )
            .from(MovieVisitStatsLastMonthView, 'mv')
            .groupBy('"mv"."movie_id"');
        },
        'mvs',
        '"mvs"."movie_id"="m"."id"',
      )
      .orderBy('"mvs"."visits_count"', 'DESC', 'NULLS LAST')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getMany();
  };

  readManyRandom = async (
    pagination?: OffsetPaginationArgsType,
  ): Promise<MovieEntity[]> => {
    return this.movieRepository
      .createQueryBuilder('m')
      .select()
      .orderBy('random()')
      .limit(pagination.limit)
      .getMany();
  };

  readOne = async (id: string): Promise<MovieEntity> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id "${id}" not found!`);
    }
    return movie;
  };

  delete = async (id: string): Promise<MovieEntity> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id ${id} not found!`);
    }
    return this.movieRepository.remove(movie);
  };
}
