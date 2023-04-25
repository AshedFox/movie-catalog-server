import { Module } from '@nestjs/common';
import { VideoAudioService } from './video-audio.service';
import { VideoAudioResolver } from './video-audio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAudioEntity } from './entities/video-audio.entity';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { PubSubModule } from '../pub-sub/pub-sub.module';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoAudioEntity]),
    FfmpegModule,
    PubSubModule,
    CloudModule,
  ],
  providers: [VideoAudioResolver, VideoAudioService],
  exports: [VideoAudioService],
})
export class VideoAudioModule {}
