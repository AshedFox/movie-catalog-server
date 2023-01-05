import { Field, InputType } from '@nestjs/graphql';
import { SeasonEntity } from '../entities/season.entity';
import { IsEnum, IsOptional, IsUUID, Length, Min } from 'class-validator';
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
  @IsOptional()
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endReleaseDate?: Date;

  @Field()
  @Min(0)
  seasonNumber: number;

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
