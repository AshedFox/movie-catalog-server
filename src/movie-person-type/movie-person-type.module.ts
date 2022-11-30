import { Module } from '@nestjs/common';
import { MoviePersonTypeService } from './movie-person-type.service';
import { MoviePersonTypeResolver } from './movie-person-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviePersonTypeEntity } from './entities/movie-person-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoviePersonTypeEntity])],
  providers: [MoviePersonTypeResolver, MoviePersonTypeService],
  exports: [MoviePersonTypeService],
})
export class MoviePersonTypeModule {}
