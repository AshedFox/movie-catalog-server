import { Type } from '@nestjs/common';
import { Type as TypeDecorator } from 'class-transformer';
import { Field, InputType, TypeMetadataStorage } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import {
  createFilterComparisonType,
  FilterableRelationMetadata,
  FilterType,
  getFilterableFields,
  getFilterableRelations,
} from '@common/filter';
import { capitalize } from '@utils/helpers';

export function Filterable<T>(classRef: Type<T>) {
  const filterableRelations = getFilterableRelations(classRef);

  const name = TypeMetadataStorage.getObjectTypeMetadataByTarget(classRef).name;

  return createFilterableType(
    classRef,
    `${capitalize(name)}Filter`,
    filterableRelations,
  );
}

function createFilterableType<T>(
  classRef: Type<T>,
  name: string,
  relations?: FilterableRelationMetadata[],
) {
  const filterableFields = getFilterableFields(classRef);

  if (filterableFields.length === 0 && relations?.length === 0) {
    throw new Error(`No filterable fields or relations in ${classRef}`);
  }

  @InputType(name)
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

    ValidateNested()(GqlFilter.prototype, propertyKey);
    Field(() => FCT, { nullable: true })(GqlFilter.prototype, propertyKey);
    TypeDecorator(() => FCT)(GqlFilter.prototype, propertyKey);
  });
  relations?.forEach(({ returnTypeFunction, propertyKey, advancedOptions }) => {
    if (!returnTypeFunction) {
      throw new Error(
        `No explicit type for filterable relation ${propertyKey} in ${classRef}`,
      );
    }

    const returnType = returnTypeFunction();
    const type: Type = Array.isArray(returnType)
      ? (returnType[0] as Type)
      : (returnType as Type);

    const FT = createFilterableType(
      type,
      `${capitalize(advancedOptions?.name ?? type.name)}_${name}`,
    );

    ValidateNested()(GqlFilter.prototype, propertyKey);
    Field(() => FT, { nullable: true })(GqlFilter.prototype, propertyKey);
    TypeDecorator(() => FT)(GqlFilter.prototype, propertyKey);
  });
  return GqlFilter as Type<FilterType<T>>;
}
