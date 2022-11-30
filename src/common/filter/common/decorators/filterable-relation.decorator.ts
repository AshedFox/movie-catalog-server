import { Type } from '@nestjs/common';
import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';
import { FieldOptions } from '@nestjs/graphql/dist/decorators/field.decorator';
import { FILTERABLE_RELATION_KEY } from '../constants';
import { Field } from '@nestjs/graphql';
import { getPrototypeChain } from '@utils/helpers';

export type FilterableRelationMetadata = {
  target: Type;
  propertyKey: string;
  returnTypeFunction: ReturnTypeFunc;
};

export function FilterableRelation(): PropertyDecorator;
export function FilterableRelation(options: FieldOptions): PropertyDecorator;
export function FilterableRelation(
  returnTypeFn?: ReturnTypeFunc,
  options?: FieldOptions,
): PropertyDecorator;

export function FilterableRelation(
  returnTypeFnOrOptions?: ReturnTypeFunc | FieldOptions,
  fieldOptions?: FieldOptions,
): PropertyDecorator {
  const [returnTypeFn, options] =
    typeof returnTypeFnOrOptions === 'function'
      ? [returnTypeFnOrOptions, fieldOptions]
      : [undefined, returnTypeFnOrOptions];

  return <D>(
    target: Record<string, unknown>,
    propertyKey?: string,
    descriptor?: TypedPropertyDescriptor<D>,
  ) => {
    const Ctx = Reflect.getMetadata('design:type', target, propertyKey) as Type;
    const data: FilterableRelationMetadata[] =
      Reflect.getMetadata(FILTERABLE_RELATION_KEY, target.constructor) ?? [];

    data.push({ target: Ctx, propertyKey, returnTypeFunction: returnTypeFn });
    Reflect.defineMetadata(FILTERABLE_RELATION_KEY, data, target.constructor);

    return Field(returnTypeFn, options)(target, propertyKey, descriptor);
  };
}

export const getFilterableRelations = <T>(
  classRef: Type<T>,
): FilterableRelationMetadata[] => {
  return getPrototypeChain(classRef).reduce((filterableRelations, type) => {
    const existingNames = filterableRelations.map((type) => type.propertyName);
    const currentRelations =
      Reflect.getMetadata(FILTERABLE_RELATION_KEY, type) ?? [];
    const newRelations = currentRelations.filter(
      (type) => !existingNames.includes(type.propertyName),
    );
    return [...newRelations, ...filterableRelations];
  }, [] as FilterableRelationMetadata[]);
};
