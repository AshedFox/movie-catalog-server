import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BetweenType, NumberFilterType } from '../../common';

@InputType()
class IntBetween implements BetweenType<number> {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  start?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  end?: number;
}

@InputType()
export class IntFilter implements NumberFilterType {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  ge?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  gte?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  lt?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  lte?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  eq?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  neq?: number;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsOptional()
  in?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsOptional()
  nin?: number[];

  @Field(() => IntBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IntBetween)
  btwn?: BetweenType<number>;

  @Field(() => IntBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IntBetween)
  nbtwn?: BetweenType<number>;
}
