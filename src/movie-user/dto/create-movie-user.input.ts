import { Field, InputType } from '@nestjs/graphql';
import { MovieUserEntity } from '../entities/movie-user.entity';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateMovieUserInput implements Partial<MovieUserEntity> {
  @Field()
  @IsUUID()
  movieId: string;

  @Field({ nullable: true })
  isWatched: boolean;

  @Field({ nullable: true })
  isBookmarked: boolean;

  @Field({ nullable: true })
  isFavorite: boolean;
}
