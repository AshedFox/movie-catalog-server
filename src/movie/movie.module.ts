import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
import { MovieStudioModule } from '../movie-studio/movie-studio.module';
import { MovieService } from './movie.service';
import { MovieResolver } from './movie.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity]),
    forwardRef(() => MovieGenreModule),
    forwardRef(() => MovieStudioModule),
  ],
  providers: [MovieService, MovieResolver],
  exports: [MovieService],
})
export class MovieModule {}
