import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { MovieImageEntity } from '../entities/movie-image.entity';
import { MovieImageTypeEnum } from '../../utils/enums/movie-image-type.enum';

@InputType()
export class CreateMovieImageInput implements Partial<MovieImageEntity> {
  @Field()
  @IsUUID()
  movieId: string;

  @Field()
  @IsUUID()
  imageId: string;

  @Field(() => MovieImageTypeEnum)
  type: MovieImageTypeEnum;
}
