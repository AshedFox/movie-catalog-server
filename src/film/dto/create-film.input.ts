import { Field, InputType, Int } from '@nestjs/graphql';
import { FilmModel } from '../entities/film.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import { AccessModeEnum } from '../../shared/access-mode.enum';

@InputType()
export class CreateFilmInput implements Partial<FilmModel> {
  @Field()
  @Length(1, 200)
  title!: string;

  @Field({ nullable: true })
  @Length(1, 2000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  releaseDate?: Date;

  @Field(() => AgeRestrictionEnum)
  @IsEnum(AgeRestrictionEnum)
  ageRestriction!: AgeRestrictionEnum;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode?: AccessModeEnum;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  postersIds?: string[];

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

  @Field({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  videoId?: string;
}
