import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { Type as TypeDecorator } from 'class-transformer';
import { Filterable, FilterType } from '../filter';
import { GqlOffsetPagination } from '../pagination';
import { Sortable, SortType } from '../sort';
import { ArgsType as AT } from './args.type';

export function GqlArgs<T>(classRef: Type<T>) {
  const FT = Filterable(classRef);
  const ST = Sortable(classRef);

  @ArgsType()
  class GqlArgs implements AT<T> {
    @ValidateNested()
    @Field(() => ST, { nullable: true })
    @TypeDecorator(() => ST)
    sort?: SortType<T>;
    @ValidateNested()
    @Field(() => GqlOffsetPagination, {
      nullable: true,
      defaultValue: { take: 20, skip: 0 },
    })
    @TypeDecorator(() => GqlOffsetPagination)
    pagination?: GqlOffsetPagination;
    @ValidateNested()
    @Field(() => FT, { nullable: true })
    @TypeDecorator(() => FT)
    filter?: FilterType<T>;
  }
  return GqlArgs as Type<AT<T>>;
}
