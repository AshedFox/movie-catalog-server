import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { MoviePersonTypeEnum } from '../../utils/enums/movie-person-type.enum';
import { MoviePersonEntity } from '../entities/movie-person.entity';

@InputType()
export class CreateMoviePersonInput implements Partial<MoviePersonEntity> {
  @Field()
  @IsUUID()
  movieId: string;

  @Field(() => Int)
  personId: number;

  @Field({ nullable: true })
  @Length(2, 200)
  @IsOptional()
  role?: string;

  @Field(() => MoviePersonTypeEnum)
  type: MoviePersonTypeEnum;
}
