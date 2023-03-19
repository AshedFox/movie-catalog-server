import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CreateVideoVariantInput } from '../../video-variant/dto/create-video-variant.input';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class Video_CreateVideoVariantInput extends OmitType(CreateVideoVariantInput, [
  'videoId',
]) {}

@InputType()
export class CreateVideoInput {
  @Field(() => [Video_CreateVideoVariantInput])
  @ValidateNested()
  @Type(() => Video_CreateVideoVariantInput)
  @IsArray()
  @ArrayNotEmpty()
  variants: Video_CreateVideoVariantInput[];
}
