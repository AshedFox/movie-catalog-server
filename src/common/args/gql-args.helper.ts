import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { Type as TypeDecorator } from 'class-transformer';
import { Filterable, FilterType } from '../filter';
import { GqlOffsetPagination } from '../pagination';
import { Sortable, SortType } from '../sort';
import { ArgsType as AT } from './args.type';

type GqlArgsOptions = {
  withPagination: boolean;
};

const defaultOptions: GqlArgsOptions = {
  withPagination: true,
};

const paginationKey = 'pagination';

export function GqlArgs<T>(
  classRef: Type<T>,
  options: GqlArgsOptions = defaultOptions,
) {
  const FT = Filterable(classRef);
  const ST = Sortable(classRef);

  @ArgsType()
  class GqlArgs implements AT<T> {
    @ValidateNested()
    @Field(() => ST, { nullable: true })
    @TypeDecorator(() => ST)
    sort?: SortType<T>;
    @ValidateNested()
    @Field(() => FT, { nullable: true })
    @TypeDecorator(() => FT)
    filter?: FilterType<T>;
  }

  if (options.withPagination) {
    ValidateNested()(GqlArgs.prototype, paginationKey);
    Field(() => GqlOffsetPagination, {
      nullable: true,
      defaultValue: { take: 20, skip: 0 },
    })(GqlArgs.prototype, paginationKey);
    TypeDecorator(() => GqlOffsetPagination)(GqlArgs.prototype, paginationKey);
  }

  return GqlArgs as Type<AT<T>>;
}
