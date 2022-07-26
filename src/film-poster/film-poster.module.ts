import { forwardRef, Module } from '@nestjs/common';
import { FilmPosterService } from './film-poster.service';
import { FilmPosterResolver } from './film-poster.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmPosterModel } from './entities/film-poster.model';
import { FilmModule } from '../film/film.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmPosterModel]),
    forwardRef(() => FilmModule),
    forwardRef(() => ImageModule),
  ],
  providers: [FilmPosterResolver, FilmPosterService],
  exports: [FilmPosterService],
})
export class FilmPosterModule {}
