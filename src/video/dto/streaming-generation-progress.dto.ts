import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StreamingGenerationProgressDto {
  @Field()
  type: 'info' | 'error';

  @Field()
  message: string;
}
