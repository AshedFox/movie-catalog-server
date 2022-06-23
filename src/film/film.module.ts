import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModel } from './entities/film.model';
import { StudioModule } from '../studio/studio.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [TypeOrmModule.forFeature([FilmModel]), StudioModule, GenreModule],
  providers: [FilmResolver, FilmService],
  exports: [FilmService],
})
export class FilmModule {}
