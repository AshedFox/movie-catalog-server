import { ArgsType, Field } from '@nestjs/graphql';
import { PaginatedArgs } from '../../shared/paginated.args';
import { IsOptional, Length } from 'class-validator';

@ArgsType()
export class GetSeriesArgs extends PaginatedArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchTitle?: string;
}
