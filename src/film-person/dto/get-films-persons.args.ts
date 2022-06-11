import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginatedArgs } from '../../shared/paginated.args';
import { SeriesPersonModel } from '../../series-person/entities/series-person.model';
import { IsOptional, IsUUID } from 'class-validator';
import { PersonTypeEnum } from '../../shared/person-type.enum';

@ArgsType()
export class GetFilmsPersonsArgs
  extends PaginatedArgs
  implements Partial<SeriesPersonModel>
{
  @Field()
  @IsUUID()
  @IsOptional()
  filmId?: string;

  @Field(() => Int)
  @IsOptional()
  personId?: number;

  @Field(() => PersonTypeEnum)
  @IsOptional()
  type?: PersonTypeEnum;
}
