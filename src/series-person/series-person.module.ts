import { Module } from '@nestjs/common';
import { SeriesPersonService } from './series-person.service';
import { SeriesPersonResolver } from './series-person.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesPersonModel } from './entities/series-person.model';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesPersonModel])],
  providers: [SeriesPersonResolver, SeriesPersonService],
  exports: [SeriesPersonService],
})
export class SeriesPersonModule {}
