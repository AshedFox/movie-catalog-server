import { Field, InputType } from '@nestjs/graphql';
import { SeriesModel } from '../entities/series.model';
import { IsEnum, IsOptional, Length } from 'class-validator';
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
  premierDate?: Date;

  @Field(() => AgeRestrictionEnum)
  @IsEnum(AgeRestrictionEnum)
  ageRestriction!: AgeRestrictionEnum;
}
