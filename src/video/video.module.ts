import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoResolver } from './video.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';
import { PubSubModule } from '../pub-sub/pub-sub.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { MediaModule } from '../media/media.module';
import { VideoVariantModule } from '../video-variant/video-variant.module';
import { VideoAudioModule } from '../video-audio/video-audio.module';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity]),
    PubSubModule,
    FfmpegModule,
    CloudModule,
    VideoVariantModule,
    VideoAudioModule,
    MediaModule,
  ],
  providers: [VideoResolver, VideoService],
  exports: [VideoService],
})
export class VideoModule {}
