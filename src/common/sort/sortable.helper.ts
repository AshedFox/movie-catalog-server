import { Type } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { capitalize } from '@utils/helpers';
import {
  FilterableRelationMetadata,
  getFilterableFields,
  getFilterableRelations,
} from '../filter';
import { SortType } from './sort.type';
import { SortOptions } from './sort-options.type';

export function Sortable<T>(classRef: Type<T>) {
  const filterableRelations = getFilterableRelations(classRef);

  return createSortableType(
    classRef,
    `${capitalize(classRef.name)}Sort`,
    filterableRelations,
  );
}

function createSortableType<T>(
  classRef: Type<T>,
  name: string,
  relations?: FilterableRelationMetadata[],
) {
  const filterableFields = getFilterableFields(classRef);

  if (filterableFields.length === 0 && relations?.length === 0) {
    throw new Error(`No sortable fields or relations in ${classRef}`);
  }

  @InputType(name)
  class GqlSort {}

  filterableFields.forEach(({ propertyKey }) => {
    Field(() => SortOptions, { nullable: true })(
      GqlSort.prototype,
      propertyKey,
    );
  });
  relations?.forEach(({ returnTypeFunction, propertyKey }) => {
    if (!returnTypeFunction) {
      throw new Error(
        `No explicit type for sortable relation ${propertyKey} in ${classRef}`,
      );
    }

    const returnType = returnTypeFunction();
    const type = Array.isArray(returnType)
      ? (returnType[0] as Type)
      : (returnType as Type);

    const ST = createSortableType(type, `${capitalize(type.name)}_${name}`);

    Field(() => ST, { nullable: true })(GqlSort.prototype, propertyKey);
  });

  return GqlSort as Type<SortType<T>>;
}
