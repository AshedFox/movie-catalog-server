import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoModel } from '../entities/video.model';
import { IsInt, IsOptional, IsPositive, IsUrl } from 'class-validator';

@InputType()
export class CreateVideoInput implements Partial<VideoModel> {
  @Field()
  @IsUrl()
  url!: string;

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
}
