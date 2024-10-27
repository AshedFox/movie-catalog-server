import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieUserService } from './movie-user.service';
import { MovieUserEntity } from './entities/movie-user.entity';
import { CreateMovieUserInput } from './dto/create-movie-user.input';
import { UpdateMovieUserInput } from './dto/update-movie-user.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { GetMoviesUsersArgs } from './dto/get-movies-users.args';
import { PaginatedMoviesUsers } from './dto/paginated-movies-users';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => MovieUserEntity)
export class MovieUserResolver {
  constructor(private readonly movieUserService: MovieUserService) {}

  @Mutation(() => MovieUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  createMovieUser(
    @Args('input') input: CreateMovieUserInput,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.movieUserService.create({ ...input, userId: currentUser.id });
  }

  @Query(() => PaginatedMoviesUsers)
  async getMoviesUsers(
    @Args() { sort, filter, ...pagination }: GetMoviesUsersArgs,
  ) {
    const [data, count] = await Promise.all([
      this.movieUserService.readMany(pagination, sort, filter),
      this.movieUserService.count(filter),
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

  @Query(() => MovieUserEntity)
  getMovieUser(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.movieUserService.readOne(movieId, userId);
  }

  @Mutation(() => MovieUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  updateMovieUser(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
    @Args('input') input: UpdateMovieUserInput,
  ) {
    return this.movieUserService.update(movieId, userId, input);
  }

  @Mutation(() => MovieUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  deleteMovieUser(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.movieUserService.delete(movieId, userId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieUser: MovieUserEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(movieUser.movieId);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() movieUser: MovieUserEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(UserEntity, 'id')
      .load(movieUser.userId);
  }
}
