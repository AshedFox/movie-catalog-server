import {
  Args,
  Context,
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
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { StudioEntity } from '../studio/entities/studio.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

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

  @Mutation(() => Boolean)
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
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(movieStudio.movieId);
  }

  @ResolveField(() => StudioEntity)
  studio(
    @Parent() movieStudio: MovieStudioEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studioLoader.load(movieStudio.studioId);
  }
}
