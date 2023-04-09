import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieStudioService } from './movie-studio.service';
import { MovieStudioEntity } from './entities/movie-studio.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => MovieStudioEntity)
export class MovieStudioResolver {
  constructor(private readonly movieStudioService: MovieStudioService) {}

  @Mutation(() => MovieStudioEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createMovieStudio(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('studioId', { type: () => Int }) studioId: number,
  ) {
    return this.movieStudioService.create(movieId, studioId);
  }

  @Mutation(() => MovieStudioEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteMovieStudio(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('studioId', { type: () => Int }) studioId: number,
  ) {
    return this.movieStudioService.delete(movieId, studioId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieStudio: MovieStudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(movieStudio.movieId);
  }

  @ResolveField(() => StudioEntity)
  studio(
    @Parent() movieStudio: MovieStudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(StudioEntity, 'id')
      .load(movieStudio.studioId);
  }
}
