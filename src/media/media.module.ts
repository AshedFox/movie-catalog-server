import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity]), CloudModule, FfmpegModule],
  providers: [MediaResolver, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
