import { Field, ID, InputType } from '@nestjs/graphql';
import { MovieUserEntity } from '../entities/movie-user.entity';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateMovieUserInput implements Partial<MovieUserEntity> {
  @Field(() => ID)
  @IsUUID()
  movieId: string;

  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field()
  isWatched: boolean;

  @Field()
  isBookmarked: boolean;
}
