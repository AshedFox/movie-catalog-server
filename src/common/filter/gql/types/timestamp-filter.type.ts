import { Field, GraphQLTimestamp, InputType } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BetweenType, DateFilterType } from '../../common';

@InputType()
class TimestampBetween implements BetweenType<Date> {
  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  start?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsInt()
  @IsOptional()
  end?: Date;
}

@InputType()
export class TimestampFilter implements DateFilterType {
  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsDateString()
  @IsOptional()
  ge?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsDateString()
  @IsOptional()
  gte?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsDateString()
  @IsOptional()
  lt?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsDateString()
  @IsOptional()
  lte?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsDateString()
  @IsOptional()
  eq?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsDateString()
  @IsOptional()
  neq?: Date;

  @Field(() => [GraphQLTimestamp], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @IsOptional()
  in?: Date[];

  @Field(() => [GraphQLTimestamp], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @IsOptional()
  nin?: Date[];

  @Field(() => TimestampBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimestampBetween)
  btwn?: BetweenType<Date>;

  @Field(() => TimestampBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimestampBetween)
  nbtwn?: BetweenType<Date>;
}
