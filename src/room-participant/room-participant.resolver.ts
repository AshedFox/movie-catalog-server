import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { RoomEntity } from '../room/entities/room.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { RoomParticipantEntity } from './entities/room-participant.entity';
import { RoomParticipantService } from './room-participant.service';
import { UserEntity } from '../user/entities/user.entity';

@Resolver(() => RoomParticipantEntity)
export class RoomParticipantResolver {
  constructor(
    private readonly roomParticipantService: RoomParticipantService,
  ) {}

  @Mutation(() => RoomParticipantEntity)
  async createRoomParticipant(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.roomParticipantService.create(roomId, userId);
  }

  @Mutation(() => Boolean)
  deleteRoomParticipant(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.roomParticipantService.delete(roomId, userId);
  }

  @ResolveField(() => RoomEntity)
  room(
    @Parent() roomParticipant: RoomParticipantEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.roomLoader.load(roomParticipant.roomId);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() roomParticipant: RoomParticipantEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.userLoader.load(roomParticipant.userId);
  }
}
