import { Module } from '@nestjs/common';
import { VideoVariantService } from './video-variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoVariantEntity } from './entities/video-variant.entity';
import { VideoVariantResolver } from './video-variant.resolver';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { PubSubModule } from '../pub-sub/pub-sub.module';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoVariantEntity]),
    CloudModule,
    FfmpegModule,
    PubSubModule,
  ],
  providers: [VideoVariantService, VideoVariantResolver],
  exports: [VideoVariantService],
})
export class VideoVariantModule {}
