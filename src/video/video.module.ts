import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoResolver } from './video.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoModel } from './entities/video.model';
import { VideoQualityModule } from '../video-quality/video-quality.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoModel]),
    VideoQualityModule,
    CloudinaryModule,
  ],
  providers: [VideoResolver, VideoService],
  exports: [VideoService],
})
export class VideoModule {}
