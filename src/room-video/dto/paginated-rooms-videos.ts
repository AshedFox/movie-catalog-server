import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { RoomVideoEntity } from '../entities/room-video.entity';

@ObjectType()
export class PaginatedRoomsVideos extends Paginated(RoomVideoEntity) {}
