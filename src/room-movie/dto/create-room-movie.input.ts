import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateRoomMovieInput {
  @Field()
  @IsUUID()
  roomId: string;

  @Field()
  @IsUUID()
  movieId: string;

  @Field(() => Int, { nullable: true })
  episodeNumber?: number;
}
