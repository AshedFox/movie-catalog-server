import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MovieEntity } from './entities/movie.entity';
import { GetMoviesArgs } from './dto/get-movies.args';
import { MovieService } from './movie.service';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OffsetPaginationArgs } from '@common/pagination/offset';
import { MovieInterfaceResolver } from './movie-interface.resolver';
import { PaginatedMovies } from './dto/paginated-movies';
import { UpdateMovieInput } from './dto/update-movie.input';

@Resolver(MovieEntity)
export class MovieResolver extends MovieInterfaceResolver {
  constructor(private readonly movieService: MovieService) {
    super();
  }

  @Query(() => PaginatedMovies)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  getMoviesProtected(@Args() { sort, filter, ...pagination }: GetMoviesArgs) {
    const [data, count] = await Promise.all([
      this.movieService.readMany(pagination, sort, filter),
      this.movieService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => PaginatedMovies)
  getMovies(@Args() { sort, filter, ...pagination }: GetMoviesArgs) {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };
    const [data, count] = await Promise.all([
      this.movieService.readMany(pagination, sort, filter),
      this.movieService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => [MovieEntity])
  getMostViewedMovies(@Args() pagination: OffsetPaginationArgs) {
    return this.movieService.readManyMostViewed(pagination);
  }

  @Query(() => [MovieEntity])
  getRandomMovies(@Args() pagination: OffsetPaginationArgs) {
    return this.movieService.readManyRandom(pagination);
  }

  @Query(() => MovieEntity)
  getMovie(@Args('id', ParseUUIDPipe) id: string) {
    return this.movieService.readOne(id);
  }

  @Mutation(() => MovieEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  updateMovie(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateMovieInput,
  ) {
    return this.movieService.update(id, input);
  }

  @Mutation(() => MovieEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteMovie(@Args('id', ParseUUIDPipe) id: string) {
    return this.movieService.delete(id);
  }
}
