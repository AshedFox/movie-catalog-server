import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoResolver } from './video.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoModel } from './entities/video.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoModel]), CloudinaryModule],
  providers: [VideoResolver, VideoService],
  exports: [VideoService],
})
export class VideoModule {}
