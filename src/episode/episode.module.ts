import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeResolver } from './episode.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeModel } from './entities/episode.model';
import { EpisodePosterModule } from '../episode-poster/episode-poster.module';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeModel]), EpisodePosterModule],
  providers: [EpisodeResolver, EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
