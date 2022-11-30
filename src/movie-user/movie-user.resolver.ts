import {
  Args,
  Context,
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
import { ParseUUIDPipe } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { PersonEntity } from '../person/entities/person.entity';
import { GetMoviesUsersArgs } from './dto/get-movies-users.args';
import { PaginatedMoviesUsers } from './dto/paginated-movies-users';

@Resolver(() => MovieUserEntity)
export class MovieUserResolver {
  constructor(private readonly movieUserService: MovieUserService) {}

  @Mutation(() => MovieUserEntity)
  createMovieUser(@Args('input') input: CreateMovieUserInput) {
    return this.movieUserService.create(input);
  }

  @Query(() => PaginatedMoviesUsers)
  getMoviesUsers(@Args() { pagination, sort, filter }: GetMoviesUsersArgs) {
    return this.movieUserService.readMany(pagination, sort, filter);
  }

  @Query(() => MovieUserEntity)
  getMovieUser(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.movieUserService.readOne(movieId, userId);
  }

  @Mutation(() => MovieUserEntity)
  updateMovieUser(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
    @Args('input') input: UpdateMovieUserInput,
  ) {
    return this.movieUserService.update(movieId, userId, input);
  }

  @Mutation(() => MovieUserEntity)
  deleteMovieUser(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.movieUserService.delete(movieId, userId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieUser: MovieUserEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(movieUser.movieId);
  }

  @ResolveField(() => PersonEntity)
  user(
    @Parent() movieUser: MovieUserEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.userLoader.load(movieUser.userId);
  }
}
