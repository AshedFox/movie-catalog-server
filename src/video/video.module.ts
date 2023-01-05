import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoResolver } from './video.resolver';

@Module({
  providers: [VideoResolver, VideoService]
})
export class VideoModule {}
