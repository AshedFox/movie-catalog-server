import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeResolver } from './episode.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeEntity } from './entities/episode.entity';
import { SeriesModule } from '../series/series.module';
import { SeasonModule } from '../season/season.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EpisodeEntity]),
    SeriesModule,
    SeasonModule,
  ],
  providers: [EpisodeResolver, EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
