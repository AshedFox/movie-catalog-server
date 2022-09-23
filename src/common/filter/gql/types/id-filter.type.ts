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
class IDBetween implements BetweenType<string | number> {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  start?: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  end?: string | number;
}

@InputType()
export class IDFilter implements UniversalFilter<string | number> {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  lt: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  lte: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  gt: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  gte: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  eq?: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  neq?: string | number;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  in?: (string | number)[];

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  nin?: (string | number)[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  like?: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  nlike?: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  ilike?: string | number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  nilike?: string | number;

  @Field(() => IDBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IDBetween)
  btwn?: BetweenType<string | number>;

  @Field(() => IDBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IDBetween)
  nbtwn?: BetweenType<string | number>;
}
