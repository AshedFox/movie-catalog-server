import { forwardRef, Module } from '@nestjs/common';
import { SeasonPosterService } from './season-poster.service';
import { SeasonPosterResolver } from './season-poster.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonPosterModel } from './entities/season-poster.model';
import { SeasonModule } from '../season/season.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeasonPosterModel]),
    forwardRef(() => SeasonModule),
    forwardRef(() => ImageModule),
  ],
  providers: [SeasonPosterResolver, SeasonPosterService],
  exports: [SeasonPosterService],
})
export class SeasonPosterModule {}
