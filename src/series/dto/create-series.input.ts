import { Field, InputType, Int } from '@nestjs/graphql';
import { SeriesModel } from '../entities/series.model';
import { IsArray, IsEnum, IsOptional, Length } from 'class-validator';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@InputType()
export class CreateSeriesInput implements Partial<SeriesModel> {
  @Field()
  @Length(1, 200)
  title!: string;

  @Field({ nullable: true })
  @Length(0, 2000)
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

  @Field(() => [Int], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray()
  studiosIds?: number[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray()
  genresIds?: string[];
}
