import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesEntity])],
  providers: [SeriesResolver, SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
