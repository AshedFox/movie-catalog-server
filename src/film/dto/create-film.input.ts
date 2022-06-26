import { Field, InputType, Int } from '@nestjs/graphql';
import { FilmModel } from '../entities/film.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { IsEnum, IsOptional, IsUUID, Length, Min } from 'class-validator';

@InputType()
export class CreateFilmInput implements Partial<FilmModel> {
  @Field()
  @Length(1, 200)
  title!: string;

  @Field({ nullable: true })
  @Length(0, 2000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  releaseDate?: Date;

  @Field(() => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  duration?: number;

  @Field(() => AgeRestrictionEnum)
  @IsEnum(AgeRestrictionEnum)
  ageRestriction!: AgeRestrictionEnum;

  @Field(() => [Int], { nullable: true, defaultValue: [] })
  @IsOptional()
  studiosIds?: number[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsOptional()
  genresIds?: string[];

  @Field()
  @IsUUID('4')
  @IsOptional()
  videoId?: string;
}
