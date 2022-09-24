import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CollectionMovieEntity } from './entities/collection-movie.entity';
import { CollectionMovieService } from './collection-movie.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GenreEntity } from '../genre/entities/genre.entity';

@Resolver(() => CollectionMovieEntity)
export class CollectionMovieResolver {
  constructor(
    private readonly collectionMovieService: CollectionMovieService,
  ) {}

  @Mutation(() => CollectionMovieEntity)
  createCollectionMovie(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('movieId', ParseUUIDPipe) movieId: string,
  ) {
    return this.collectionMovieService.create(collectionId, movieId);
  }

  @Mutation(() => Boolean)
  deleteCollectionMovie(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('movieId', ParseUUIDPipe) movieId: string,
  ) {
    return this.collectionMovieService.delete(collectionId, movieId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() collectionMovie: CollectionMovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(collectionMovie.movieId);
  }

  @ResolveField(() => GenreEntity)
  collection(
    @Parent() collectionMovie: CollectionMovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.collectionLoader.load(collectionMovie.collectionId);
  }
}
