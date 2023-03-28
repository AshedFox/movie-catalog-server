import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { CollectionEntity } from '../entities/collection.entity';

@ObjectType()
export class PaginatedCollections extends Paginated(CollectionEntity) {}
