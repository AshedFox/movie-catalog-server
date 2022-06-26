import { forwardRef, Module } from '@nestjs/common';
import { FilmGenreService } from './film-genre.service';
import { FilmGenreResolver } from './film-genre.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmGenreModel } from './entities/film-genre.model';
import { FilmModule } from '../film/film.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmGenreModel]),
    forwardRef(() => FilmModule),
    forwardRef(() => GenreModule),
  ],
  providers: [FilmGenreResolver, FilmGenreService],
  exports: [FilmGenreService],
})
export class FilmGenreModule {}
