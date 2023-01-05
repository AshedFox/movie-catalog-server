import { Field, InputType } from '@nestjs/graphql';
import { FilmEntity } from '../entities/film.entity';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateMovieInput } from '../../movie/dto/create-movie.input';

@InputType()
export class CreateFilmInput
  extends CreateMovieInput
  implements Partial<FilmEntity>
{
  @Field({ nullable: true })
  @IsOptional()
  releaseDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  videoId?: number;
}
