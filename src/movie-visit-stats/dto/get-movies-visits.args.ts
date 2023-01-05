import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MovieVisitStatsLastMonthView } from '../entities/movie-visit-stats-last-month.view';

@ArgsType()
export class GetMoviesVisitsArgs extends GqlArgs(
  MovieVisitStatsLastMonthView,
) {}
