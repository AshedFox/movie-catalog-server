import { Module } from '@nestjs/common';
import { MovieImageService } from './movie-image.service';
import { MovieImageResolver } from './movie-image.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieImageEntity } from './entities/movie-image.entity';
import { MovieModule } from '../movie/movie.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieImageEntity]),
    MovieModule,
    MediaModule,
  ],
  providers: [MovieImageResolver, MovieImageService],
  exports: [MovieImageService],
})
export class MovieImageModule {}
