import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
import { StringFilterType } from '../../common';

@InputType()
export class StringFilter implements StringFilterType {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  eq?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  neq?: string;

  @Field(() => String, { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  in?: string[];

  @Field(() => String, { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  nin?: string[];

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  like?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nlike?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  ilike?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nilike?: string;
}
