import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './entities/film.entity';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
import { MovieStudioModule } from '../movie-studio/movie-studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmEntity]),
    MovieGenreModule,
    MovieStudioModule,
  ],
  providers: [FilmResolver, FilmService],
  exports: [FilmService],
})
export class FilmModule {}
