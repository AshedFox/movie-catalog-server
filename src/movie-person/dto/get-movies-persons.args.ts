import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginatedArgs } from '../../utils/paginated.args';
import { IsOptional, IsUUID } from 'class-validator';
import { MoviePersonTypeEnum } from '../../utils/enums/movie-person-type.enum';
import { MoviePersonEntity } from '../entities/movie-person.entity';

@ArgsType()
export class GetMoviesPersonsArgs
  extends PaginatedArgs
  implements Partial<MoviePersonEntity>
{
  @Field()
  @IsUUID()
  @IsOptional()
  movieId?: string;

  @Field(() => Int)
  @IsOptional()
  personId?: number;

  @Field(() => MoviePersonTypeEnum)
  @IsOptional()
  type?: MoviePersonTypeEnum;
}
