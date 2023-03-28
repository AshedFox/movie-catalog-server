import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { MovieVisitStatsLastMonthView } from '../entities/movie-visit-stats-last-month.view';

@ObjectType()
export class PaginatedMoviesVisits extends Paginated(
  MovieVisitStatsLastMonthView,
) {}
