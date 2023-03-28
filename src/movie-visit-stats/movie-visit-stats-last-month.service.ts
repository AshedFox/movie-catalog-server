import { FilterType } from '@common/filter';
import { MovieVisitStatsLastMonthView } from './entities/movie-visit-stats-last-month.view';
import { SortType } from '@common/sort';
import { OffsetPaginationArgsType } from '@common/pagination/offset';
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
    pagination?: OffsetPaginationArgsType,
  ) => {
    const qb = parseArgsToQuery(
      this.movieVisitStatsLastMonthRepository,
      pagination,
      sort,
      filter,
    );
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    const { take, skip } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > take + skip,
        hasPreviousPage: skip > 0,
      },
    };
  };
}
