import { ObjectType } from '@nestjs/graphql';
import { CollectionReviewEntity } from '../entities/collection-review.entity';
import { Connection, Edge } from '@common/pagination/relay';
import { Paginated } from '@common/pagination/offset';

@ObjectType()
export class CollectionReviewEdge extends Edge(CollectionReviewEntity) {}

@ObjectType()
export class RelayPaginatedCollectionsReviews extends Connection(
  CollectionReviewEdge,
  CollectionReviewEntity,
) {}

@ObjectType()
export class OffsetPaginatedCollectionsReviews extends Paginated(
  CollectionReviewEntity,
) {}
