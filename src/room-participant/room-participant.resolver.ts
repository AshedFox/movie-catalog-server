import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { RoomEntity } from '../room/entities/room.entity';
import { RoomParticipantEntity } from './entities/room-participant.entity';
import { RoomParticipantService } from './room-participant.service';
import { UserEntity } from '../user/entities/user.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => RoomParticipantEntity)
export class RoomParticipantResolver {
  constructor(
    private readonly roomParticipantService: RoomParticipantService,
  ) {}

  @Mutation(() => RoomParticipantEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createRoomParticipant(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.roomParticipantService.create(roomId, userId);
  }

  @Mutation(() => RoomParticipantEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteRoomParticipant(
    @Args('roomId', ParseUUIDPipe) roomId: string,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.roomParticipantService.delete(roomId, userId);
  }

  @ResolveField(() => RoomEntity)
  room(
    @Parent() roomParticipant: RoomParticipantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(RoomEntity, 'id')
      .load(roomParticipant.roomId);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() roomParticipant: RoomParticipantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(UserEntity, 'id')
      .load(roomParticipant.userId);
  }
}
