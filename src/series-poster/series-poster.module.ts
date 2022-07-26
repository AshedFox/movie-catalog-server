import { forwardRef, Module } from '@nestjs/common';
import { SeriesPosterService } from './series-poster.service';
import { SeriesPosterResolver } from './series-poster.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesPosterModel } from './entities/series-poster.model';
import { SeriesModule } from '../series/series.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeriesPosterModel]),
    forwardRef(() => SeriesModule),
    forwardRef(() => ImageModule),
  ],
  providers: [SeriesPosterResolver, SeriesPosterService],
  exports: [SeriesPosterService],
})
export class SeriesPosterModule {}
