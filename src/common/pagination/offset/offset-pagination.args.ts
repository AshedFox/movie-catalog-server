import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { OffsetPaginationArgsType } from './types';

@ArgsType()
export class OffsetPaginationArgs implements OffsetPaginationArgsType {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int, { defaultValue: 20 })
  @Min(1)
  take: number;
}
