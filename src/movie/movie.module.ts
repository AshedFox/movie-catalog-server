import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
import { MovieStudioModule } from '../movie-studio/movie-studio.module';
import { MovieService } from './movie.service';
import { MovieResolver } from './movie.resolver';
import { MovieCountryModule } from '../movie-country/movie-country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity]),
    forwardRef(() => MovieCountryModule),
    forwardRef(() => MovieGenreModule),
    forwardRef(() => MovieStudioModule),
  ],
  providers: [MovieService, MovieResolver],
  exports: [MovieService],
})
export class MovieModule {}
