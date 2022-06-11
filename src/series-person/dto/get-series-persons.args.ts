import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SeriesPersonModel } from '../entities/series-person.model';
import { PaginatedArgs } from '../../shared/paginated.args';
import { PersonTypeEnum } from '../../shared/person-type.enum';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetSeriesPersonsArgs
  extends PaginatedArgs
  implements Partial<SeriesPersonModel>
{
  @Field()
  @IsUUID()
  @IsOptional()
  seriesId?: string;

  @Field(() => Int)
  @IsOptional()
  personId?: number;

  @Field(() => PersonTypeEnum)
  @IsOptional()
  type?: PersonTypeEnum;
}
