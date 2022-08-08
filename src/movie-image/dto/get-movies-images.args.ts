import { ArgsType, Field } from '@nestjs/graphql';
import { PaginatedArgs } from '../../utils/paginated.args';
import { IsOptional, IsUUID } from 'class-validator';
import { MovieImageEntity } from '../entities/movie-image.entity';
import { MovieImageTypeEnum } from '../../utils/enums/movie-image-type.enum';

@ArgsType()
export class GetMoviesImagesArgs
  extends PaginatedArgs
  implements Partial<MovieImageEntity>
{
  @Field()
  @IsUUID()
  @IsOptional()
  movieId?: string;

  @Field()
  @IsOptional()
  imageId?: string;

  @Field(() => MovieImageTypeEnum)
  @IsOptional()
  type?: MovieImageTypeEnum;
}
