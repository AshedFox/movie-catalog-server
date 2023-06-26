import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieResolver } from './movie.resolver';
import { MovieInterfaceResolver } from './movie-interface.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [MovieService, MovieResolver, MovieInterfaceResolver],
  exports: [MovieService],
})
export class MovieModule {}
