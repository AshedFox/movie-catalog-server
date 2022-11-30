import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';
import { FieldOptions } from '@nestjs/graphql/dist/decorators/field.decorator';
import { Field } from '@nestjs/graphql';
import { FILTERABLE_FIELD_KEY } from '../constants';
import { Type } from '@nestjs/common';
import { getPrototypeChain } from '@utils/helpers';

export type FilterableFieldMetadata = {
  target: Type;
  propertyKey: string;
  returnTypeFunction: ReturnTypeFunc;
};

export function FilterableField(): PropertyDecorator;
export function FilterableField(options: FieldOptions): PropertyDecorator;
export function FilterableField(
  returnTypeFn?: ReturnTypeFunc,
  options?: FieldOptions,
): PropertyDecorator;

export function FilterableField(
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
    const data: FilterableFieldMetadata[] =
      Reflect.getMetadata(FILTERABLE_FIELD_KEY, target.constructor) ?? [];

    data.push({ target: Ctx, propertyKey, returnTypeFunction: returnTypeFn });
    Reflect.defineMetadata(FILTERABLE_FIELD_KEY, data, target.constructor);

    return Field(returnTypeFn, options)(target, propertyKey, descriptor);
  };
}

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
