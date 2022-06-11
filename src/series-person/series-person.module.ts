import { Module } from '@nestjs/common';
import { SeriesPersonService } from './series-person.service';
import { SeriesPersonResolver } from './series-person.resolver';

@Module({
  providers: [SeriesPersonResolver, SeriesPersonService],
})
export class SeriesPersonModule {}
