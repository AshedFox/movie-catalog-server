import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RoomVideoService } from './room-video.service';
import { CreateRoomVideoInput } from './dto/create-room-video.input';
import { MoveRoomVideoInput } from './dto/move-room-video.input';
import { RoomVideoEntity } from './entities/room-video.entity';
import { PaginatedRoomsVideos } from './dto/paginated-rooms-videos';
import { GetRoomsVideosArgs } from './dto/get-rooms-videos.args';
import { ParseUUIDPipe } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { VideoEntity } from '../video/entities/video.entity';
import { RoomEntity } from '../room/entities/room.entity';

@Resolver(() => RoomVideoEntity)
export class RoomVideoResolver {
  constructor(private readonly roomVideoService: RoomVideoService) {}

  @Mutation(() => RoomVideoEntity)
  createRoomVideo(@Args('input') input: CreateRoomVideoInput) {
    return this.roomVideoService.create(input);
  }

  @Query(() => PaginatedRoomsVideos)
  getRoomsVideos(@Args() { sort, filter, ...pagination }: GetRoomsVideosArgs) {
    return this.roomVideoService.readMany(pagination, sort, filter);
  }

  @Query(() => RoomVideoEntity, { name: 'roomVideo' })
  getRoomVideo(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('videoId', { type: () => Int }) videoId: number,
  ) {
    return this.roomVideoService.readOne(roomId, videoId);
  }

  @Mutation(() => RoomVideoEntity)
  moveRoomVideo(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('input') input: MoveRoomVideoInput,
  ) {
    return this.roomVideoService.move(roomId, input);
  }

  @Mutation(() => RoomVideoEntity)
  deleteRoomVideo(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('videoId', { type: () => Int }) videoId: number,
  ) {
    return this.roomVideoService.delete(roomId, videoId);
  }

  @ResolveField(() => RoomEntity)
  room(
    @Parent() roomVideo: RoomVideoEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.roomLoader.load(roomVideo.roomId);
  }

  @ResolveField(() => VideoEntity)
  video(
    @Parent() roomVideo: RoomVideoEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.videoLoader.load(roomVideo.videoId);
  }
}
