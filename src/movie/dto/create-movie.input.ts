import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { MovieEntity } from '../entities/movie.entity';
import { AgeRestrictionEnum } from '@utils/enums/age-restriction.enum';

@InputType()
export class CreateMovieInput implements Partial<MovieEntity> {
  @Field()
  @Length(1, 255)
  title: string;

  @Field({ nullable: true })
  @Length(1, 20000)
  @IsOptional()
  description?: string;

  @Field(() => AgeRestrictionEnum, { nullable: true })
  @IsEnum(AgeRestrictionEnum)
  @IsOptional()
  ageRestriction?: AgeRestrictionEnum;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode: AccessModeEnum;

  @Field({ nullable: true })
  @IsOptional()
  coverId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  countriesIds?: string[];

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
}
