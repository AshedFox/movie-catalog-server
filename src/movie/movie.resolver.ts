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

@Resolver(MovieEntity)
export class MovieResolver extends MovieInterfaceResolver {
  constructor(private readonly movieService: MovieService) {
    super();
  }

  @Query(() => PaginatedMovies)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  getMoviesProtected(@Args() { sort, filter, ...pagination }: GetMoviesArgs) {
    return this.movieService.readMany(pagination, sort, filter);
  }

  @Query(() => PaginatedMovies)
  getMovies(@Args() { sort, filter, ...pagination }: GetMoviesArgs) {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };
    return this.movieService.readMany(pagination, sort, filter);
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
  deleteMovie(@Args('id', ParseUUIDPipe) id: string) {
    return this.movieService.delete(id);
  }
}
