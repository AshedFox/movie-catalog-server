import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeResolver } from './episode.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeEntity } from './entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeEntity])],
  providers: [EpisodeResolver, EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
