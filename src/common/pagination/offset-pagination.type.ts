import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class GqlOffsetPagination {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int, { defaultValue: 20 })
  @Min(1)
  take: number;
}
