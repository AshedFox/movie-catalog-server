import { forwardRef, Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionResolver } from './collection.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './entities/collection.entity';
import { CollectionMovieModule } from '../collection-movie/collection-movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionEntity]),
    forwardRef(() => CollectionMovieModule),
  ],
  providers: [CollectionResolver, CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
