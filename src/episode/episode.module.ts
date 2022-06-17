import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeResolver } from './episode.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeModel } from './entities/episode.model';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeModel])],
  providers: [EpisodeResolver, EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
