import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoEntity } from '../entities/video.entity';
import { IsInt } from 'class-validator';

@InputType()
export class CreateVideoInput implements Partial<VideoEntity> {
  @Field(() => Int)
  @IsInt()
  fileId: number;
}
