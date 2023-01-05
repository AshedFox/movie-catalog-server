import { Field, HideField, InputType, Int } from '@nestjs/graphql';
import { MovieReviewEntity } from '../entities/movie-review.entity';
import { IsOptional, IsUUID, Length, Max, Min } from 'class-validator';

@InputType()
export class CreateMovieReviewInput implements Partial<MovieReviewEntity> {
  @Field(() => Int)
  @Min(1)
  @Max(10)
  mark: number;

  @Field({ nullable: true })
  @Length(1, 3000)
  @IsOptional()
  text?: string;

  @HideField()
  userId: string;

  @Field()
  @IsUUID()
  movieId: string;
}
