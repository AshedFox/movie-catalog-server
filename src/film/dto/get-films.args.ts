import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';
import { PaginatedArgs } from '../../shared/paginated.args';

@ArgsType()
export class GetFilmsArgs extends PaginatedArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchTitle?: string;
}
