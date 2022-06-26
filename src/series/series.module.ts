import { forwardRef, Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModel } from './entities/series.model';
import { SeriesStudioModule } from '../series-studio/series-studio.module';
import { SeriesGenreModule } from '../series-genre/series-genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeriesModel]),
    forwardRef(() => SeriesStudioModule),
    forwardRef(() => SeriesGenreModule),
  ],
  providers: [SeriesResolver, SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
