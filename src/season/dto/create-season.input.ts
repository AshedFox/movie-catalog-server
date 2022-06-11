import { Field, InputType, Int } from '@nestjs/graphql';
import { SeasonModel } from '../entities/season.model';
import { IsEnum, IsOptional, IsUUID, Length, Min } from 'class-validator';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@InputType()
export class CreateSeasonInput implements Partial<SeasonModel> {
  @Field()
  @Length(1, 200)
  title!: string;

  @Field({ nullable: true })
  @Length(0, 2000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  premierDate?: Date;

  @Field(() => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  seasonNumber?: number;

  @Field(() => AgeRestrictionEnum)
  @IsEnum(AgeRestrictionEnum)
  ageRestriction!: AgeRestrictionEnum;

  @Field()
  @IsUUID('4')
  seriesId!: string;
}
