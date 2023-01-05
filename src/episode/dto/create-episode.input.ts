import { Field, InputType, Int } from '@nestjs/graphql';
import { EpisodeEntity } from '../entities/episode.entity';
import { IsEnum, IsOptional, IsUUID, Length, Min } from 'class-validator';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';

@InputType()
export class CreateEpisodeInput implements Partial<EpisodeEntity> {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @Length(1, 20000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  releaseDate?: Date;

  @Field()
  @Min(0)
  numberInSeries: number;

  @Field({ nullable: true })
  @Min(0)
  @IsOptional()
  numberInSeason?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  ageRestrictionId?: number;

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
