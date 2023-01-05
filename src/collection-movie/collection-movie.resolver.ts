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
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { CollectionEntity } from '../collection/entities/collection.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

@Resolver(() => CollectionMovieEntity)
export class CollectionMovieResolver {
  constructor(
    private readonly collectionMovieService: CollectionMovieService,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => CollectionMovieEntity)
  createCollectionMovie(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('movieId', ParseUUIDPipe) movieId: string,
  ) {
    return this.collectionMovieService.create(collectionId, movieId);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
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

  @ResolveField(() => CollectionEntity)
  collection(
    @Parent() collectionMovie: CollectionMovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.collectionLoader.load(collectionMovie.collectionId);
  }
}
