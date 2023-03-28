import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';
import { RelayPaginationArgsType } from './types';

@ArgsType()
export class RelayPaginationArgs implements RelayPaginationArgsType {
  @Field(() => Int, { nullable: true })
  @IsPositive()
  @IsOptional()
  first?: number;

  @Field({ nullable: true })
  @IsOptional()
  after?: string;

  @Field(() => Int, { nullable: true })
  @IsPositive()
  @IsOptional()
  last?: number;

  @Field({ nullable: true })
  @IsOptional()
  before?: string;
}
