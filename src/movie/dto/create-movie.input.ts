import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { MovieEntity } from '../entities/movie.entity';

@InputType()
export class CreateMovieInput implements Partial<MovieEntity> {
  @Field()
  @Length(1, 200)
  title: string;

  @Field({ nullable: true })
  @Length(1, 20000)
  @IsOptional()
  description?: string;

  @Field(() => Int)
  ageRestrictionId: number;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode: AccessModeEnum;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  coverId?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  countriesIds?: number[];

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
