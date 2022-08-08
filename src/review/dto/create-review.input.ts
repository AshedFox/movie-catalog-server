import { Field, InputType, Int } from '@nestjs/graphql';
import { ReviewEntity } from '../entities/review.entity';
import { IsOptional, IsUUID, Length, Max, Min } from 'class-validator';

@InputType()
export class CreateReviewInput implements Partial<ReviewEntity> {
  @Field(() => Int)
  @Min(1)
  @Max(10)
  mark: number;

  @Field({ nullable: true })
  @Length(1, 3000)
  @IsOptional()
  text?: string;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsUUID()
  movieId: string;
}
