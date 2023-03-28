import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MovieVisitStatsService } from './movie-visit-stats.service';
import { GetMoviesVisitsArgs } from './dto/get-movies-visits.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovieVisitStatsLastMonthService } from './movie-visit-stats-last-month.service';
import { PaginatedMoviesVisits } from './dto/paginated-movies-visits';

@Resolver()
export class MovieVisitStatsResolver {
  constructor(
    private readonly movieVisitStatsService: MovieVisitStatsService,
    private readonly movieVisitStatsLastMonthService: MovieVisitStatsLastMonthService,
  ) {}

  @Mutation(() => Boolean)
  increaseMovieVisits(@Args('movieId', ParseUUIDPipe) movieId: string) {
    return this.movieVisitStatsService.create(movieId);
  }

  @Query(() => PaginatedMoviesVisits)
  getLastMonthMoviesVisits(
    @Args() { sort, filter, ...pagination }: GetMoviesVisitsArgs,
  ) {
    return this.movieVisitStatsLastMonthService.readMany(
      filter,
      sort,
      pagination,
    );
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Mutation(() => Boolean)
  updateLastMonthView() {
    return this.movieVisitStatsLastMonthService.updateView();
  }
}
