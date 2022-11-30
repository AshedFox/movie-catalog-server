import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RoomService } from './room.service';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { RoomEntity } from './entities/room.entity';
import { PaginatedRooms } from './dto/paginated-rooms';
import { GetRoomsArgs } from './dto/get-rooms.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { UserEntity } from '../user/entities/user.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CurrentUserDto } from '../user/dto/current-user.dto';

@Resolver(() => RoomEntity)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => RoomEntity)
  @UseGuards(GqlJwtAuthGuard)
  createRoom(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('input') createRoomInput: CreateRoomInput,
  ) {
    createRoomInput.ownerId = currentUser.id;
    return this.roomService.create(createRoomInput);
  }

  @Query(() => PaginatedRooms)
  getRooms(@Args() { pagination, filter, sort }: GetRoomsArgs) {
    return this.roomService.readMany(pagination, sort, filter);
  }

  @Query(() => RoomEntity)
  getRoom(@Args('id', ParseUUIDPipe) id: string) {
    return this.roomService.readOne(id);
  }

  @Mutation(() => RoomEntity)
  updateRoom(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') updateRoomInput: UpdateRoomInput,
  ) {
    return this.roomService.update(id, updateRoomInput);
  }

  @Mutation(() => Boolean)
  deleteRoom(@Args('id', ParseUUIDPipe) id: string) {
    return this.roomService.delete(id);
  }

  @ResolveField(() => [UserEntity])
  participants(
    @Parent() room: RoomEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.usersByRoomLoader.load(room.id);
  }

  @ResolveField(() => VideoEntity, { nullable: true })
  currentVideo(
    @Parent() room: RoomEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return room.currentVideoId
      ? loaders.videoLoader.load(room.currentVideoId)
      : null;
  }

  @ResolveField(() => UserEntity)
  owner(@Parent() room: RoomEntity, @Context('loaders') loaders: IDataLoaders) {
    return room.ownerId ? loaders.userLoader.load(room.currentVideoId) : null;
  }
}
