import { Field, ID, InputType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BetweenType, UniversalFilter } from '../../common';

@InputType()
class IDBetween implements BetweenType<string> {
  @Field(() => ID)
  start: string;

  @Field(() => ID)
  end: string;
}

@InputType()
export class IDFilter implements UniversalFilter<string> {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  lt: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  lte: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  gt: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  gte: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  eq?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  neq?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  in?: string[];

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  nin?: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  like?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  nlike?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  ilike?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  nilike?: string;

  @Field(() => IDBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IDBetween)
  btwn?: BetweenType<string>;

  @Field(() => IDBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IDBetween)
  nbtwn?: BetweenType<string>;
}
