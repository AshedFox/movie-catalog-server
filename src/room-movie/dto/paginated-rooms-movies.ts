import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { RoomMovieEntity } from '../entities/room-movie.entity';

@ObjectType()
export class PaginatedRoomsMovies extends Paginated(RoomMovieEntity) {}
