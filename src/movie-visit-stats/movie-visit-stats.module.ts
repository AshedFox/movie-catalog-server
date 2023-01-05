import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieVisitStatsEntity } from './entities/movie-visit-stats.entity';
import { MovieVisitStatsLastMonthView } from './entities/movie-visit-stats-last-month.view';
import { MovieVisitStatsService } from './movie-visit-stats.service';
import { MovieVisitStatsResolver } from './movie-visit-stats.resolver';
import { MovieVisitStatsLastMonthService } from './movie-visit-stats-last-month.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieVisitStatsEntity,
      MovieVisitStatsLastMonthView,
    ]),
  ],
  providers: [
    MovieVisitStatsService,
    MovieVisitStatsLastMonthService,
    MovieVisitStatsResolver,
  ],
  exports: [MovieVisitStatsService, MovieVisitStatsLastMonthService],
})
export class MovieVisitStatsModule {}
