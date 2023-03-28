import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { MediaEntity } from '../entities/media.entity';

@ObjectType()
export class PaginatedMedia extends Paginated(MediaEntity) {}
