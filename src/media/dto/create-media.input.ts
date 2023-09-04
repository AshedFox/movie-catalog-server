import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
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
