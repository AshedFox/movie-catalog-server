import { CreateReviewInput } from './create-review.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
