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
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GetMoviesUsersArgs } from './dto/get-movies-users.args';
import { PaginatedMoviesUsers } from './dto/paginated-movies-users';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { UserEntity } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';

@Resolver(() => MovieUserEntity)
export class MovieUserResolver {
  constructor(private readonly movieUserService: MovieUserService) {}

  @Mutation(() => MovieUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  createMovieUser(
    @Args('input') input: CreateMovieUserInput,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    input.userId = currentUser.id;
    return this.movieUserService.create(input);
  }

  @Query(() => PaginatedMoviesUsers)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
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
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(movieUser.movieId);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() movieUser: MovieUserEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.userLoader.load(movieUser.userId);
  }
}
