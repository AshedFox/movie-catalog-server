import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginatedArgs } from '../../utils/paginated.args';
import { ArrayNotEmpty, IsArray, IsOptional, Length } from 'class-validator';

@ArgsType()
export class GetPersonsArgs extends PaginatedArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchName?: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  countriesIds?: number[];
}
