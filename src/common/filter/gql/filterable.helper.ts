import { Type } from '@nestjs/common';
import { Type as TypeDecorator } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { FilterableFieldMetadata, FilterType } from '../common';
import { FILTERABLE_FIELD_KEY } from '../common/constants';
import { capitalize } from '../../../utils/capitalize.helper';
import { createFilterComparisonType } from './create-filter-comparison-type.helper';

const getPrototypeChain = <T>(classRef: Type<T>) => {
  const baseClass = Object.getPrototypeOf(classRef);
  if (baseClass) {
    return [classRef, ...getPrototypeChain(baseClass)];
  }
  return [classRef];
};

export const getFilterableFields = <T>(
  classRef: Type<T>,
): FilterableFieldMetadata[] => {
  return getPrototypeChain(classRef).reduce((filterableFields, type) => {
    const existingNames = filterableFields.map((type) => type.propertyName);
    const currentFields = Reflect.getMetadata(FILTERABLE_FIELD_KEY, type) ?? [];
    const newFields = currentFields.filter(
      (type) => !existingNames.includes(type.propertyName),
    );
    return [...newFields, ...filterableFields];
  }, [] as FilterableFieldMetadata[]);
};

export function Filterable<T>(classRef: Type<T>) {
  const filterableFields = getFilterableFields(classRef);
  if (!filterableFields.length) {
    throw new Error(`No filterable fields in ${classRef}`);
  }
  @InputType(`${capitalize(classRef.name)}Filter`)
  class GqlFilter {
    @ValidateNested()
    @Field(() => [GqlFilter], { nullable: true })
    @TypeDecorator(() => GqlFilter)
    and?: FilterType<T>[];

    @ValidateNested()
    @Field(() => [GqlFilter], { nullable: true })
    @TypeDecorator(() => GqlFilter)
    or?: FilterType<T>[];
  }

  filterableFields.forEach(({ returnTypeFunction, target, propertyKey }) => {
    const FCT = createFilterComparisonType(target, returnTypeFunction);
    Field(() => FCT, { nullable: true })(GqlFilter.prototype, propertyKey);
  });
  return GqlFilter as Type<FilterType<T>>;
}
