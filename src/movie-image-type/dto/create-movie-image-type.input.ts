import { Field, InputType } from '@nestjs/graphql';
import { MovieImageTypeEntity } from '../entities/movie-image-type.entity';

@InputType()
export class CreateMovieImageTypeInput
  implements Partial<MovieImageTypeEntity>
{
  @Field()
  name: string;
}
