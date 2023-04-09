import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieGenreService } from './movie-genre.service';
import { MovieGenreEntity } from './entities/movie-genre.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => MovieGenreEntity)
export class MovieGenreResolver {
  constructor(private readonly movieGenreService: MovieGenreService) {}

  @Mutation(() => MovieGenreEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createMovieGenre(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.movieGenreService.create(movieId, genreId);
  }

  @Mutation(() => MovieGenreEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteMovieGenre(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.movieGenreService.delete(movieId, genreId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieGenre: MovieGenreEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(movieGenre.movieId);
  }

  @ResolveField(() => GenreEntity)
  genre(
    @Parent() movieGenre: MovieGenreEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(GenreEntity, 'id')
      .load(movieGenre.genreId);
  }
}
