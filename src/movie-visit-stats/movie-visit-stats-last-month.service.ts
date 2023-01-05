import { FilterType } from '@common/filter';
import { MovieVisitStatsLastMonthView } from './entities/movie-visit-stats-last-month.view';
import { SortType } from '@common/sort';
import { GqlOffsetPagination } from '@common/pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieVisitStatsEntity } from './entities/movie-visit-stats.entity';
import { Repository } from 'typeorm';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class MovieVisitStatsLastMonthService {
  constructor(
    @InjectRepository(MovieVisitStatsLastMonthView)
    private readonly movieVisitStatsLastMonthRepository: Repository<MovieVisitStatsEntity>,
  ) {}

  updateView = async () => {
    await this.movieVisitStatsLastMonthRepository.query(
      'REFRESH MATERIALIZED VIEW "movie_visit_stats_last_month"',
    );
    return true;
  };

  readMany = async (
    filter?: FilterType<MovieVisitStatsLastMonthView>,
    sort?: SortType<MovieVisitStatsLastMonthView>,
    pagination?: GqlOffsetPagination,
  ) => {
    const qb = parseArgsToQuery(
      this.movieVisitStatsLastMonthRepository,
      pagination,
      sort,
      filter,
    );
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };
}
