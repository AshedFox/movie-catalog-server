import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { FilmPersonModule } from '../film-person/film-person.module';

@Module({
  imports: [FilmPersonModule],
  providers: [FilmResolver, FilmService],
})
export class FilmModule {}
