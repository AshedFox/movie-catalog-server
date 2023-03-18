import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './entities/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity])],
  providers: [FilmResolver, FilmService],
  exports: [FilmService],
})
export class FilmModule {}
