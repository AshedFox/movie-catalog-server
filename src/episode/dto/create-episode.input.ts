import { Field, InputType, Int } from '@nestjs/graphql';
import { EpisodeModel } from '../entities/episode.model';
import {
  IsEnum,
  IsOptional,
  IsUUID,
  Length,
  Min,
  MinLength,
} from 'class-validator';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@InputType()
export class CreateEpisodeInput implements Partial<EpisodeModel> {
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
  duration?: number;

  @Field(() => Int, { nullable: true })
  @Min(0)
  episodeNumber!: number;

  @Field(() => AgeRestrictionEnum)
  @IsEnum(AgeRestrictionEnum)
  ageRestriction!: AgeRestrictionEnum;

  @Field({ nullable: true })
  @MinLength(5)
  @IsOptional()
  videoUrl?: string;

  @Field()
  @IsUUID('4')
  seasonId!: string;

  @Field()
  @IsUUID('4')
  seriesId!: string;
}
