import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VideoVariantsProgressDto {
  @Field()
  type: 'info' | 'error';

  @Field()
  message: string;
}
