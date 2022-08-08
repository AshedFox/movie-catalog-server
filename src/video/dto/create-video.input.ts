import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoEntity } from '../entities/video.entity';
import { IsInt, IsOptional, IsPositive, IsUrl } from 'class-validator';

@InputType()
export class CreateVideoInput implements Partial<VideoEntity> {
  @Field()
  @IsUrl()
  url: string;

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
