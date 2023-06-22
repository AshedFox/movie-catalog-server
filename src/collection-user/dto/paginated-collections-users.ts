import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { CollectionUserEntity } from '../entities/collection-user.entity';

@ObjectType()
export class PaginatedCollectionsUsers extends Paginated(
  CollectionUserEntity,
) {}
