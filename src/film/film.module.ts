import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './entities/film.entity';
import { MovieCountryEntity } from '../movie-country/entities/movie-country.entity';
import { MovieGenreEntity } from '../movie-genre/entities/movie-genre.entity';
import { MovieStudioEntity } from '../movie-studio/entities/movie-studio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FilmEntity,
      MovieCountryEntity,
      MovieGenreEntity,
      MovieStudioEntity,
    ]),
  ],
  providers: [FilmResolver, FilmService],
  exports: [FilmService],
})
export class FilmModule {}
