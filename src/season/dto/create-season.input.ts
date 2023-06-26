import { Field, InputType, Int } from '@nestjs/graphql';
import { SeasonEntity } from '../entities/season.entity';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { AgeRestrictionEnum } from '@utils/enums/age-restriction.enum';

@InputType()
export class CreateSeasonInput implements Partial<SeasonEntity> {
  @Field({ nullable: true })
  @Length(1, 255)
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @Length(1, 20000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endReleaseDate?: Date;

  @Field(() => Int)
  @Min(0)
  numberInSeries: number;

  @Field(() => AgeRestrictionEnum, { nullable: true })
  @IsEnum(AgeRestrictionEnum)
  @IsOptional()
  ageRestriction?: AgeRestrictionEnum;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode: AccessModeEnum;

  @Field()
  @IsUUID('4')
  seriesId: string;
}
