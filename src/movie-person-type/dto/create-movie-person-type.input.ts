import { Field, InputType } from '@nestjs/graphql';
import { MoviePersonTypeEntity } from '../entities/movie-person-type.entity';
import { MinLength } from 'class-validator';

@InputType()
export class CreateMoviePersonTypeInput
  implements Partial<MoviePersonTypeEntity>
{
  @Field()
  @MinLength(1)
  name: string;
}
