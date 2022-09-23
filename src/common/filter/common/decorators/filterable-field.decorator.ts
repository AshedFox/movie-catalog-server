import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';
import { FieldOptions } from '@nestjs/graphql/dist/decorators/field.decorator';
import { Field } from '@nestjs/graphql';
import { FILTERABLE_FIELD_KEY } from '../constants';
import { Type } from '@nestjs/common';

export type FilterableFieldMetadata = {
  target: Type;
  propertyKey: string | symbol;
  returnTypeFunction: ReturnTypeFunc;
};

export const FilterableField = (
  returnTypeFunction?: ReturnTypeFunc,
  options?: FieldOptions,
): PropertyDecorator => {
  return <D>(
    target: Object,
    propertyKey?: string,
    descriptor?: TypedPropertyDescriptor<D>,
  ) => {
    const Ctx = Reflect.getMetadata('design:type', target, propertyKey) as Type;
    const data: FilterableFieldMetadata[] =
      Reflect.getMetadata(FILTERABLE_FIELD_KEY, target.constructor) ?? [];
    data.push({ target: Ctx, propertyKey, returnTypeFunction });
    Reflect.defineMetadata(FILTERABLE_FIELD_KEY, data, target.constructor);
    return Field(returnTypeFunction, options)(target, propertyKey, descriptor);
  };
};
