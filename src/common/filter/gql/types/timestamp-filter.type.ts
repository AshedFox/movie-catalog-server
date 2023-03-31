import { Field, GraphQLTimestamp, InputType } from '@nestjs/graphql';
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
class TimestampBetween implements BetweenType<number> {
  @Field(() => GraphQLTimestamp)
  @IsInt()
  start: number;

  @Field(() => GraphQLTimestamp)
  @IsInt()
  end: number;
}

@InputType()
export class TimestampFilter implements NumberFilterType {
  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  gt?: number;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  gte?: number;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  lt?: number;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  lte?: number;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  eq?: number;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  neq?: number;

  @Field(() => [GraphQLTimestamp], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsOptional()
  in?: number[];

  @Field(() => [GraphQLTimestamp], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsOptional()
  nin?: number[];

  @Field(() => TimestampBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimestampBetween)
  btwn?: BetweenType<number>;

  @Field(() => TimestampBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimestampBetween)
  nbtwn?: BetweenType<number>;
}
