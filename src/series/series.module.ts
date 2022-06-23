import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModel } from './entities/series.model';
import { StudioModule } from '../studio/studio.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesModel]), StudioModule, GenreModule],
  providers: [SeriesResolver, SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
