import { InputType, Field, Int } from '@nestjs/graphql';
import { AudioProfileEnum, VideoProfileEnum } from '@utils/enums';
import {
  IsArray,
  IsNotEmpty,
  ArrayUnique,
  IsEnum,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateStreamingDirectlyInput {
  @Field(() => Int)
  id: number;

  @Field()
  @IsUrl()
  url: string;

  @Field(() => [AudioProfileEnum])
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsEnum(AudioProfileEnum, { each: true })
  audioProfiles: AudioProfileEnum[];

  @Field(() => [VideoProfileEnum])
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsEnum(VideoProfileEnum, { each: true })
  videoProfiles: VideoProfileEnum[];
}
