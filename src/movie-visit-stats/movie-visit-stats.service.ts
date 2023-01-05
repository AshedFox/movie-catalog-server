import { Injectable } from '@nestjs/common';
import { MovieVisitStatsEntity } from './entities/movie-visit-stats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieVisitStatsLastMonthView } from './entities/movie-visit-stats-last-month.view';
import { Repository } from 'typeorm';

@Injectable()
export class MovieVisitStatsService {
  constructor(
    @InjectRepository(MovieVisitStatsEntity)
    private readonly movieVisitStatsRepository: Repository<MovieVisitStatsEntity>,
    @InjectRepository(MovieVisitStatsLastMonthView)
    private readonly movieVisitStatsLastMonthRepository: Repository<MovieVisitStatsEntity>,
  ) {}

  create = async (movieId: string) => {
    await this.movieVisitStatsRepository.save({
      movieId,
    });
    return true;
  };
}
