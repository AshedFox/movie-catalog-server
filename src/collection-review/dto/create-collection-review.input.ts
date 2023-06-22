import { Field, HideField, InputType, Int } from '@nestjs/graphql';
import { CollectionReviewEntity } from '../entities/collection-review.entity';
import { IsOptional, Length, Max, Min } from 'class-validator';

@InputType()
export class CreateCollectionReviewInput
  implements Partial<CollectionReviewEntity>
{
  @Field(() => Int)
  @Min(1)
  @Max(10)
  mark: number;

  @Field({ nullable: true })
  @Length(3, 4096)
  @IsOptional()
  text?: string;

  @HideField()
  userId: string;

  @Field(() => Int)
  collectionId: number;
}
