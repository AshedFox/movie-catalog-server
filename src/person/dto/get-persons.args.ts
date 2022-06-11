import { ArgsType, Field } from '@nestjs/graphql';
import { PaginatedArgs } from '../../shared/paginated.args';
import { IsOptional, Length } from 'class-validator';

@ArgsType()
export class GetPersonsArgs extends PaginatedArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchName?: string;
}
