import { Field, InputType, Int } from '@nestjs/graphql';
import { SeriesModel } from '../entities/series.model';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { AccessModeEnum } from '../../shared/access-mode.enum';

@InputType()
export class CreateSeriesInput implements Partial<SeriesModel> {
  @Field()
  @Length(1, 200)
  title!: string;

  @Field({ nullable: true })
  @Length(1, 2000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endReleaseDate?: Date;

  @Field(() => AgeRestrictionEnum)
  @IsEnum(AgeRestrictionEnum)
  ageRestriction!: AgeRestrictionEnum;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode?: AccessModeEnum;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  studiosIds?: number[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  genresIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  postersIds?: string[];
}
