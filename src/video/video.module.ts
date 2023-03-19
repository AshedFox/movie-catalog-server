import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoResolver } from './video.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity])],
  providers: [VideoResolver, VideoService],
  exports: [VideoService],
})
export class VideoModule {}
