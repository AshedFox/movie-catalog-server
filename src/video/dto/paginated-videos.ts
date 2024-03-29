import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { VideoEntity } from '../entities/video.entity';

@ObjectType()
export class PaginatedVideos extends Paginated(VideoEntity) {}
