import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CreateVideoVariantInput } from '../../video-variant/dto/create-video-variant.input';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubtitlesInput } from '../../subtitles/dto/create-subtitles.input';

@InputType()
class Video_CreateVideoVariantInput extends OmitType(CreateVideoVariantInput, [
  'videoId',
]) {}

@InputType()
class Video_CreateSubtitlesInput extends OmitType(CreateSubtitlesInput, [
  'videoId',
]) {}

@InputType()
export class CreateVideoInput {
  @Field(() => [Video_CreateSubtitlesInput])
  @ValidateNested()
  @Type(() => Video_CreateVideoVariantInput)
  @IsArray()
  subtitles: Video_CreateSubtitlesInput[];

  @Field(() => [Video_CreateVideoVariantInput])
  @ValidateNested()
  @Type(() => Video_CreateVideoVariantInput)
  @IsArray()
  @ArrayNotEmpty()
  variants: Video_CreateVideoVariantInput[];
}
