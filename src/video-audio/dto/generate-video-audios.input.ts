import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { AudioProfileEnum } from '@utils/enums/audio-profile.enum';

@InputType()
export class GenerateVideoAudiosInput {
  @Field(() => Int)
  videoId: number;

  @Field()
  languageId: string;

  @Field(() => [AudioProfileEnum])
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsEnum(AudioProfileEnum, { each: true })
  profiles: AudioProfileEnum[];
}
