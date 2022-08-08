import { forwardRef, Module } from '@nestjs/common';
import { MovieGenreService } from './movie-genre.service';
import { MovieGenreResolver } from './movie-genre.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieGenreEntity } from './entities/movie-genre.entity';
import { GenreModule } from '../genre/genre.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieGenreEntity]),
    forwardRef(() => MovieModule),
    forwardRef(() => GenreModule),
  ],
  providers: [MovieGenreResolver, MovieGenreService],
  exports: [MovieGenreService],
})
export class MovieGenreModule {}
