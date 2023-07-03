import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import { IsArray, IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { FormatEnum } from '@utils/enums/format.enum';

@InputType()
export class GenerateVideoVariantsInput {
  @Field(() => Int)
  videoId: number;

  @Field()
  @IsUrl()
  originalMediaUrl: string;

  @Field(() => [VideoProfileEnum])
  @IsArray()
  @IsNotEmpty()
  @IsEnum(VideoProfileEnum, { each: true })
  profiles: VideoProfileEnum[];

  @Field(() => FormatEnum)
  @IsEnum(FormatEnum)
  format: FormatEnum;
}
