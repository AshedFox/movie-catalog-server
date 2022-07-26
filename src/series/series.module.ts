import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModel } from './entities/series.model';
import { SeriesStudioModule } from '../series-studio/series-studio.module';
import { SeriesGenreModule } from '../series-genre/series-genre.module';
import { SeriesPosterModule } from '../series-poster/series-poster.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeriesModel]),
    SeriesStudioModule,
    SeriesGenreModule,
    SeriesPosterModule,
  ],
  providers: [SeriesResolver, SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
