import { forwardRef, Module } from '@nestjs/common';
import { SeriesStudioService } from './series-studio.service';
import { SeriesStudioResolver } from './series-studio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModule } from '../series/series.module';
import { StudioModule } from '../studio/studio.module';
import { SeriesStudioModel } from './entities/series-studio.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeriesStudioModel]),
    forwardRef(() => SeriesModule),
    forwardRef(() => StudioModule),
  ],
  providers: [SeriesStudioResolver, SeriesStudioService],
  exports: [SeriesStudioService],
})
export class SeriesStudioModule {}
