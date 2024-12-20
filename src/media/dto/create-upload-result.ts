import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUploadResult {
  @Field(() => ID)
  mediaId: string;

  @Field()
  uploadUrl: string;
}
