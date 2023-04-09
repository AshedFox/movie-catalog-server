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
import { ForbiddenException, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { UserEntity } from '../user/entities/user.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { ActionEnum } from '@utils/enums/action.enum';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Resolver(() => RoomEntity)
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
  @UseGuards(GqlJwtAuthGuard)
  async getRooms(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args() { sort, filter, ...pagination }: GetRoomsArgs,
  ) {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (ability.cannot(ActionEnum.READ, RoomEntity)) {
      filter = {
        ...filter,
        ownerId: {
          eq: currentUser.id,
        },
      };
    }

    const [data, count] = await Promise.all([
      this.roomService.readMany(pagination, sort, filter),
      this.roomService.count(filter),
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

  @Query(() => RoomEntity)
  @UseGuards(GqlJwtAuthGuard)
  async getRoom(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('id', ParseUUIDPipe) id: string,
  ) {
    const room = await this.roomService.readOne(id);
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (ability.cannot(ActionEnum.READ, room)) {
      throw new ForbiddenException();
    }

    return room;
  }

  @Mutation(() => RoomEntity)
  @UseGuards(GqlJwtAuthGuard)
  async updateRoom(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') updateRoomInput: UpdateRoomInput,
  ) {
    const room = await this.roomService.readOne(id);
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (ability.cannot(ActionEnum.UPDATE, room)) {
      throw new ForbiddenException();
    }

    return this.roomService.update(id, updateRoomInput);
  }

  @Mutation(() => RoomEntity)
  @UseGuards(GqlJwtAuthGuard)
  async deleteRoom(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('id', ParseUUIDPipe) id: string,
  ) {
    const room = await this.roomService.readOne(id);
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (ability.cannot(ActionEnum.DELETE, room)) {
      throw new ForbiddenException();
    }

    return this.roomService.delete(id);
  }

  @Mutation(() => String)
  @UseGuards(GqlJwtAuthGuard)
  async makeInviteForRoom(
    @Args('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    const room = await this.roomService.readOne(id);
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (ability.cannot(ActionEnum.UPDATE, room)) {
      throw new ForbiddenException();
    }

    return this.roomService.makeInviteToken(room);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  async joinRoomWithInvite(
    @Args('inviteToken') inviteToken: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.roomService.joinWithInvite(inviteToken, currentUser.id);
  }

  @ResolveField(() => [UserEntity])
  participants(
    @Parent() room: RoomEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.usersByRoomLoader.load(room.id);
  }

  @ResolveField(() => VideoEntity, { nullable: true })
  videos(
    @Parent() room: RoomEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.videosByRoomLoader.load(room.id);
  }

  @ResolveField(() => UserEntity)
  owner(@Parent() room: RoomEntity, @Context('loaders') loaders: IDataLoaders) {
    return room.ownerId ? loaders.userLoader.load(room.ownerId) : null;
  }
}
