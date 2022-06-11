import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeResolver } from './episode.resolver';
import { SeasonModule } from '../season/season.module';
import { SeriesModule } from '../series/series.module';

@Module({
  imports: [SeasonModule, SeriesModule],
  providers: [EpisodeResolver, EpisodeService],
})
export class EpisodeModule {}
