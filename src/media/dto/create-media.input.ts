import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { IsEnum } from 'class-validator';

@InputType()
export class CreateMediaInput {
  @Field(() => GraphQLUpload)
  file: FileUpload;

  @Field(() => MediaTypeEnum)
  @IsEnum(MediaTypeEnum)
  type: MediaTypeEnum;
}
