import { Module } from '@nestjs/common';
import { FilmPersonService } from './film-person.service';
import { FilmPersonResolver } from './film-person.resolver';

@Module({
  providers: [FilmPersonResolver, FilmPersonService],
  exports: [FilmPersonService],
})
export class FilmPersonModule {}
