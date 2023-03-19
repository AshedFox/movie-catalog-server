import { Module } from '@nestjs/common';
import { VideoVariantService } from './video-variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoVariantEntity } from './entities/video-variant.entity';
import { VideoVariantResolver } from './video-variant.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([VideoVariantEntity])],
  providers: [VideoVariantService, VideoVariantResolver],
  exports: [VideoVariantService],
})
export class VideoVariantModule {}
