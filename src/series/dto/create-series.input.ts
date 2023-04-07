import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';
import { CreateMovieInput } from '../../movie/dto/create-movie.input';

@InputType()
export class CreateSeriesInput extends CreateMovieInput {
  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endReleaseDate?: Date;
}
