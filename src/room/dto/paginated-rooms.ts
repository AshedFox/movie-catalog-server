import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { RoomEntity } from '../entities/room.entity';

@ObjectType()
export class PaginatedRooms extends Paginated(RoomEntity) {}
