import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { RoomMovieEntity } from '../entities/room-movie.entity';

@ArgsType()
export class GetRoomsMoviesArgs extends GqlArgs(RoomMovieEntity) {}
