import { Type } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { capitalize } from '../../utils/capitalize.helper';
import { getFilterableFields } from '../filter';
import { SortType } from './sort.type';
import { SortOptions } from './sort-options.type';

export function Sortable<T>(classRef: Type<T>) {
  const filterableFields = getFilterableFields(classRef);
  if (!filterableFields.length) {
    throw new Error(`No sortable fields in ${classRef}`);
  }

  @InputType(`${capitalize(classRef.name)}Sort`)
  class GqlSort {}

  filterableFields.forEach(({ propertyKey }) => {
    Field(() => SortOptions, { nullable: true })(
      GqlSort.prototype,
      propertyKey,
    );
  });

  return GqlSort as Type<SortType<T>>;
}
