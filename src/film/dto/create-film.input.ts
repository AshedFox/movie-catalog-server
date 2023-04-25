import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateMovieInput } from '../../movie/dto/create-movie.input';

@InputType()
export class CreateFilmInput extends CreateMovieInput {
  @Field({ nullable: true })
  @IsOptional()
  releaseDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  videoId?: number;
}
