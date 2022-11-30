import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { RoomEntity } from '../entities/room.entity';

@ArgsType()
export class GetRoomsArgs extends GqlArgs(RoomEntity) {}
