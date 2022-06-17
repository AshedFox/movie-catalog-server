import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModel } from './entities/film.model';

@Module({
  imports: [TypeOrmModule.forFeature([FilmModel])],
  providers: [FilmResolver, FilmService],
  exports: [FilmService],
})
export class FilmModule {}
