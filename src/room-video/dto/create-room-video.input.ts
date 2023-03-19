import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateRoomVideoInput {
  @Field()
  roomId: string;

  @Field(() => Int)
  @IsInt()
  videoId: number;
}
