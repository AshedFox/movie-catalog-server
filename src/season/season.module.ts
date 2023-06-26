import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonEntity } from './entities/season.entity';
import { SeriesModule } from '../series/series.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity]), SeriesModule],
  providers: [SeasonResolver, SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
