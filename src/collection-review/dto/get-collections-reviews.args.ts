import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { CollectionReviewEntity } from '../entities/collection-review.entity';

@ArgsType()
export class GetCollectionsReviewsRelayArgs extends GqlArgs(
  CollectionReviewEntity,
  'relay',
) {}

@ArgsType()
export class GetCollectionsReviewsOffsetArgs extends GqlArgs(
  CollectionReviewEntity,
  'take-skip',
) {}
