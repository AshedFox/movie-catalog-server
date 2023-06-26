import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { RoomEntity } from '../room/entities/room.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RoomMovieEntity } from './entities/room-movie.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { MoveRoomMovieInput } from './dto/move-room-movie.input';
import { PaginatedRoomsMovies } from './dto/paginated-rooms-movies';
import { GetRoomsMoviesArgs } from './dto/get-rooms-movies.args';
import { CreateRoomMovieInput } from './dto/create-room-movie.input';
import { RoomMovieService } from './room-movie.service';

@Resolver(() => RoomMovieEntity)
export class RoomMovieResolver {
  constructor(private readonly roomMovieService: RoomMovieService) {}

  @Mutation(() => RoomMovieEntity)
  createRoomMovie(@Args('input') input: CreateRoomMovieInput) {
    return this.roomMovieService.create(input);
  }

  @Query(() => PaginatedRoomsMovies)
  getRoomsMovies(@Args() { sort, filter, ...pagination }: GetRoomsMoviesArgs) {
    return this.roomMovieService.readMany(pagination, sort, filter);
  }

  @Query(() => RoomMovieEntity)
  getRoomMovie(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('movieId', ParseUUIDPipe) movieId: string,
  ) {
    return this.roomMovieService.readOne(roomId, movieId);
  }

  @Mutation(() => RoomMovieEntity)
  moveRoomMovie(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('input') input: MoveRoomMovieInput,
  ) {
    return this.roomMovieService.move(roomId, input);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => RoomMovieEntity)
  startRoomMovie(@Args('roomId', ParseUUIDPipe) roomId: string) {
    return this.roomMovieService.start(roomId);
  }

  @Mutation(() => RoomMovieEntity)
  deleteRoomMovie(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('movieId', ParseUUIDPipe) movieId: string,
  ) {
    return this.roomMovieService.delete(roomId, movieId);
  }

  @ResolveField(() => RoomEntity)
  room(
    @Parent() roomMovie: RoomMovieEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(RoomEntity, 'id')
      .load(roomMovie.roomId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() roomMovie: RoomMovieEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(roomMovie.movieId);
  }
}
