import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination';
import { CollectionEntity } from '../entities/collection.entity';

@ObjectType()
export class PaginatedCollections extends Paginated(CollectionEntity) {}
