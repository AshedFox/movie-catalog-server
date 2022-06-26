import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModel } from './entities/film.model';
import { FilmGenreModule } from '../film-genre/film-genre.module';
import { FilmStudioModule } from '../film-studio/film-studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmModel]),
    FilmGenreModule,
    FilmStudioModule,
  ],
  providers: [FilmResolver, FilmService],
  exports: [FilmService],
})
export class FilmModule {}
