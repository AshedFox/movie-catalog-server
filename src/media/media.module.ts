import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity]), CloudinaryModule],
  providers: [MediaResolver, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
