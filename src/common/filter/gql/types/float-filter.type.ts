import { Field, Float, InputType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsDecimal,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BetweenType, NumberFilterType } from '../../common';

@InputType()
class FloatBetween implements BetweenType<number> {
  @Field(() => Float)
  @IsDecimal()
  start: number;

  @Field(() => Float)
  @IsDecimal()
  end: number;
}

@InputType()
export class FloatFilter implements NumberFilterType {
  @Field(() => Float, { nullable: true })
  @IsDecimal()
  @IsOptional()
  gt?: number;

  @Field(() => Float, { nullable: true })
  @IsDecimal()
  @IsOptional()
  gte?: number;

  @Field(() => Float, { nullable: true })
  @IsDecimal()
  @IsOptional()
  lt?: number;

  @Field(() => Float, { nullable: true })
  @IsDecimal()
  @IsOptional()
  lte?: number;

  @Field(() => Float, { nullable: true })
  @IsDecimal()
  @IsOptional()
  eq?: number;

  @Field(() => Float, { nullable: true })
  @IsDecimal()
  @IsOptional()
  neq?: number;

  @Field(() => [Float], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal({}, { each: true })
  @IsOptional()
  in?: number[];

  @Field(() => [Float], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal({}, { each: true })
  @IsOptional()
  nin?: number[];

  @Field(() => FloatBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => FloatBetween)
  btwn?: BetweenType<number>;

  @Field(() => FloatBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => FloatBetween)
  nbtwn?: BetweenType<number>;
}
