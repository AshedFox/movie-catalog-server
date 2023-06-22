import { CreateCollectionReviewInput } from './create-collection-review.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCollectionReviewInput extends PartialType(
  CreateCollectionReviewInput,
) {}
