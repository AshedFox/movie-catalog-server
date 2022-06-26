import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from './entities/image.model';

@Module({
  imports: [TypeOrmModule.forFeature([ImageModel])],
  providers: [ImageResolver, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
