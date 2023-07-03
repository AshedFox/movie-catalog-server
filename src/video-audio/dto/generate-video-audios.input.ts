import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import { IsArray, IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { AudioProfileEnum } from '@utils/enums/audio-profile.enum';
import { FormatEnum } from '@utils/enums/format.enum';

@InputType()
export class GenerateVideoAudiosInput {
  @Field(() => Int)
  videoId: number;

  @Field()
  languageId: string;

  @Field()
  @IsUrl()
  originalMediaUrl: string;

  @Field(() => [VideoProfileEnum])
  @IsArray()
  @IsNotEmpty()
  @IsEnum(AudioProfileEnum, { each: true })
  profiles: AudioProfileEnum[];

  @Field(() => FormatEnum)
  @IsEnum(FormatEnum)
  format: FormatEnum;
}
