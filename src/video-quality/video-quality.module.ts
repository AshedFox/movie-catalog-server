import { forwardRef, Module } from '@nestjs/common';
import { VideoQualityService } from './video-quality.service';
import { VideoQualityResolver } from './video-quality.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoQualityModel } from './entities/video-quality.model';
import { VideoModule } from '../video/video.module';
import { QualityModule } from '../quality/quality.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoQualityModel]),
    forwardRef(() => VideoModule),
    forwardRef(() => QualityModule),
  ],
  providers: [VideoQualityResolver, VideoQualityService],
  exports: [VideoQualityService],
})
export class VideoQualityModule {}
