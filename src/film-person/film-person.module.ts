import { Module } from '@nestjs/common';
import { FilmPersonService } from './film-person.service';
import { FilmPersonResolver } from './film-person.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmPersonModel } from './entities/film-person.model';

@Module({
  imports: [TypeOrmModule.forFeature([FilmPersonModel])],
  providers: [FilmPersonResolver, FilmPersonService],
  exports: [FilmPersonService],
})
export class FilmPersonModule {}
