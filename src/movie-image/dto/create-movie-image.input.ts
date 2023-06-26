import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { MovieImageEntity } from '../entities/movie-image.entity';

@InputType()
export class CreateMovieImageInput implements Partial<MovieImageEntity> {
  @Field()
  @IsUUID()
  movieId: string;

  @Field()
  @IsUUID()
  imageId: string;

  @Field(() => Int)
  typeId: number;
}
