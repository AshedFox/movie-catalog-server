import { Field, InputType } from '@nestjs/graphql';
import { BetweenType, DateFilterType } from '../../common';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class DateBetween implements BetweenType<Date> {
  @Field()
  @IsDate()
  start: Date;

  @Field()
  @IsDate()
  end: Date;
}

@InputType()
export class DateFilter implements DateFilterType {
  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  gt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  gte?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  lt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  lte?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  eq?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  neq?: Date;

  @Field(() => [Date], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDate()
  @IsOptional()
  in?: Date[];

  @Field(() => [Date], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @IsOptional()
  nin?: Date[];

  @Field(() => DateBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateBetween)
  btwn?: BetweenType<Date>;

  @Field(() => DateBetween, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateBetween)
  nbtwn?: BetweenType<Date>;
}
