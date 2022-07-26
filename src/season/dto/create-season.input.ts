import { Field, InputType } from '@nestjs/graphql';
import { SeasonModel } from '../entities/season.model';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { AccessModeEnum } from '../../shared/access-mode.enum';

@InputType()
export class CreateSeasonInput implements Partial<SeasonModel> {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  title?: string;

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

  @Field()
  @Min(0)
  seasonNumber!: number;

  @Field(() => AgeRestrictionEnum, { nullable: true })
  @IsEnum(AgeRestrictionEnum)
  @IsOptional()
  ageRestriction?: AgeRestrictionEnum;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode?: AccessModeEnum;

  @Field()
  @IsUUID('4')
  seriesId!: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  postersIds?: string[];
}
