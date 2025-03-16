import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AudioVariantsProgressDto {
  @Field()
  type: 'info' | 'error';

  @Field()
  message: string;
}
