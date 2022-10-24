import { Field, InputType } from '@nestjs/graphql';
import { SortDirectionEnum } from './sort-direction.enum';
import { SortNullsEnum } from './sort-nulls.enum';

export type SortOptionsType = {
  direction?: SortDirectionEnum;
  nulls?: SortNullsEnum;
};

@InputType()
export class SortOptions implements SortOptionsType {
  @Field(() => SortDirectionEnum, { nullable: true })
  direction?: SortDirectionEnum;

  @Field(() => SortNullsEnum, { nullable: true })
  nulls?: SortNullsEnum;
}
