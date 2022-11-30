import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { RoomEntity } from '../entities/room.entity';

@ObjectType()
export class PaginatedRooms extends Paginated(RoomEntity) {}
