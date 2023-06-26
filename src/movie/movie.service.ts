import { Injectable } from '@nestjs/common';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OffsetPaginationArgsType } from '@common/pagination/offset';
import { MovieVisitStatsLastMonthView } from '../movie-visit-stats/entities/movie-visit-stats-last-month.view';
import { BaseService } from '@common/services';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { MovieReviewEntity } from '../movie-review/entities/movie-review.entity';

@Injectable()
export class MovieService extends BaseService<
  MovieEntity,
  CreateMovieInput,
  UpdateMovieInput
> {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {
    super(movieRepository);
  }

  readManyMostReviewed = async (
    pagination: OffsetPaginationArgsType,
  ): Promise<MovieEntity[]> => {
    return this.movieRepository
      .createQueryBuilder('m')
      .select()
      .leftJoin(
        (qb) => {
          return qb
            .select(
              '"mr"."movie_id" as movie_id, count("mr"."movie_id") as reviews_count',
            )
            .from(MovieReviewEntity, 'mr')
            .where(
              "created_at >= date_trunc('day',(now() - interval '1 month'))",
            )
            .groupBy('"mr"."movie_id"');
        },
        'lmmr',
        '"lmmr"."movie_id" = "m"."id"',
      )
      .orderBy('"lmmr"."reviews_count"', 'DESC', 'NULLS LAST')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getMany();
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
}
