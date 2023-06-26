import { Field, InputType } from '@nestjs/graphql';
import { EpisodeEntity } from '../entities/episode.entity';
import { IsEnum, IsOptional, IsUUID, Length, Min } from 'class-validator';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { AgeRestrictionEnum } from '@utils/enums/age-restriction.enum';

@InputType()
export class CreateEpisodeInput implements Partial<EpisodeEntity> {
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
  releaseDate?: Date;

  @Field({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  coverId: string;

  @Field()
  @Min(0)
  numberInSeries: number;

  @Field({ nullable: true })
  @Min(0)
  @IsOptional()
  numberInSeason?: number;

  @Field(() => AgeRestrictionEnum, { nullable: true })
  @IsOptional()
  @IsEnum(AgeRestrictionEnum)
  ageRestriction?: AgeRestrictionEnum;

  @Field(() => AccessModeEnum, { nullable: true })
  @IsEnum(AccessModeEnum)
  @IsOptional()
  accessMode?: AccessModeEnum;

  @Field({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  seasonId?: string;

  @Field()
  @IsUUID('4')
  seriesId: string;

  @Field({ nullable: true })
  @IsOptional()
  videoId?: number;
}
