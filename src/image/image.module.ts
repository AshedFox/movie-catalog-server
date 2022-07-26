import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from './entities/image.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageModel]), CloudinaryModule],
  providers: [ImageResolver, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
