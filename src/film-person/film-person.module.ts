import { Module } from '@nestjs/common';
import { FilmPersonService } from './film-person.service';
import { FilmPersonResolver } from './film-person.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmPersonModel } from './entities/film-person.model';
import { FilmModule } from '../film/film.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmPersonModel]),
    FilmModule,
    PersonModule,
  ],
  providers: [FilmPersonResolver, FilmPersonService],
  exports: [FilmPersonService],
})
export class FilmPersonModule {}
