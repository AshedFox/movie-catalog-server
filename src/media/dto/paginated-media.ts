import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { MediaEntity } from '../entities/media.entity';

@ObjectType()
export class PaginatedMedia extends Paginated(MediaEntity) {}
