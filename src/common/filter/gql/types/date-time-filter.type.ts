import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { BetweenType, DateFilterType } from '../../common';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class DateTimeBetween implements BetweenType<Date> {
  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsInt()
  @IsOptional()
  start?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsInt()
  @IsOptional()
  end?: Date;
}

@InputType()
export class DateTimeFilter implements DateFilterType {
  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDateString()
  @IsOptional()
  ge?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDateString()
  @IsOptional()
  gte?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDateString()
  @IsOptional()
  lt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDateString()
  @IsOptional()
  lte?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDateString()
  @IsOptional()
  eq?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDateString()
  @IsOptional()
  neq?: Date;

  @Field(() => [GraphQLISODateTime], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @IsOptional()
  in?: Date[];

  @Field(() => [GraphQLISODateTime], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @IsOptional()
  nin?: Date[];

  @Field(() => DateTimeBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeBetween)
  btwn?: BetweenType<Date>;

  @Field(() => DateTimeBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeBetween)
  nbtwn?: BetweenType<Date>;
}
