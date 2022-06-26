import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoModel } from '../entities/video.model';
import { IsArray, IsInt, IsOptional, IsPositive, IsUrl } from 'class-validator';

@InputType()
export class CreateVideoInput implements Partial<VideoModel> {
  @Field()
  @IsUrl()
  baseUrl!: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  height?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  width?: number;

  @Field(() => [Int], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray()
  qualitiesIds?: number[];
}
