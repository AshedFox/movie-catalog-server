import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class GenerateVideoVariantsInput {
  @Field(() => Int)
  videoId: number;

  @Field(() => [VideoProfileEnum])
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsEnum(VideoProfileEnum, { each: true })
  profiles: VideoProfileEnum[];
}
