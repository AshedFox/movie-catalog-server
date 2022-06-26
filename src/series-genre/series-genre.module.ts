import { forwardRef, Module } from '@nestjs/common';
import { SeriesGenreService } from './series-genre.service';
import { SeriesGenreResolver } from './series-genre.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesGenreModel } from './entities/series-genre.model';
import { SeriesModule } from '../series/series.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeriesGenreModel]),
    forwardRef(() => SeriesModule),
    forwardRef(() => GenreModule),
  ],
  providers: [SeriesGenreResolver, SeriesGenreService],
  exports: [SeriesGenreService],
})
export class SeriesGenreModule {}
