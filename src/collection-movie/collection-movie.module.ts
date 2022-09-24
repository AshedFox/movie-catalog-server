import { forwardRef, Module } from '@nestjs/common';
import { CollectionMovieService } from './collection-movie.service';
import { CollectionMovieResolver } from './collection-movie.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionMovieEntity } from './entities/collection-movie.entity';
import { CollectionModule } from '../collection/collection.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionMovieEntity]),
    forwardRef(() => CollectionModule),
    forwardRef(() => MovieModule),
  ],
  providers: [CollectionMovieResolver, CollectionMovieService],
  exports: [CollectionMovieService],
})
export class CollectionMovieModule {}
