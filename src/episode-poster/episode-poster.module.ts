import { forwardRef, Module } from '@nestjs/common';
import { EpisodePosterService } from './episode-poster.service';
import { EpisodePosterResolver } from './episode-poster.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodePosterModel } from './entities/episode-poster.model';
import { EpisodeModule } from '../episode/episode.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EpisodePosterModel]),
    forwardRef(() => EpisodeModule),
    forwardRef(() => ImageModule),
  ],
  providers: [EpisodePosterResolver, EpisodePosterService],
  exports: [EpisodePosterService],
})
export class EpisodePosterModule {}
