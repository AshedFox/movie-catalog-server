import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class MoveRoomMovieInput {
  @Field(() => Int)
  @Min(1)
  @Max(32767)
  oldOrder: number;

  @Field(() => Int)
  @Min(1)
  @Max(32767)
  newOrder: number;
}
