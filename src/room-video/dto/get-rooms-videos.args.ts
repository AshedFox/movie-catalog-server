import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { RoomVideoEntity } from '../entities/room-video.entity';

@ArgsType()
export class GetRoomsVideosArgs extends GqlArgs(RoomVideoEntity) {}
