import { Module } from '@nestjs/common';
import { MovieImageTypeService } from './movie-image-type.service';
import { MovieImageTypeResolver } from './movie-image-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieImageTypeEntity } from './entities/movie-image-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieImageTypeEntity])],
  providers: [MovieImageTypeResolver, MovieImageTypeService],
  exports: [MovieImageTypeService],
})
export class MovieImageTypeModule {}
