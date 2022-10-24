import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';
import { FieldOptions } from '@nestjs/graphql/dist/decorators/field.decorator';
import { Field } from '@nestjs/graphql';
import { FILTERABLE_FIELD_KEY } from '../constants';
import { Type } from '@nestjs/common';
import { reflectTypeFromMetadata } from '@nestjs/graphql/dist/utils/reflection.utilts';

export type FilterableFieldMetadata = {
  target: Type;
  propertyKey: string | symbol;
  returnTypeFunction: ReturnTypeFunc;
};

export function FilterableField(): PropertyDecorator;
export function FilterableField(options: FieldOptions): PropertyDecorator;
export function FilterableField(
  returnType?: ReturnTypeFunc,
  options?: FieldOptions,
): PropertyDecorator;

export function FilterableField(
  returnTypeOrOptions?: ReturnTypeFunc | FieldOptions,
  fieldOptions?: FieldOptions,
): PropertyDecorator {
  const [returnType, options] =
    typeof returnTypeOrOptions === 'function'
      ? [returnTypeOrOptions, fieldOptions]
      : [undefined, returnTypeOrOptions];

  return <D>(
    target: Object,
    propertyKey?: string,
    descriptor?: TypedPropertyDescriptor<D>,
  ) => {
    const { typeFn, options: typeOptions } = reflectTypeFromMetadata({
      metadataKey: 'design:type',
      prototype: target,
      propertyKey,
      explicitTypeFn: returnType,
      typeOptions: options,
    });
    const Ctx = Reflect.getMetadata('design:type', target, propertyKey) as Type;
    const data: FilterableFieldMetadata[] =
      Reflect.getMetadata(FILTERABLE_FIELD_KEY, target.constructor) ?? [];

    data.push({ target: Ctx, propertyKey, returnTypeFunction: typeFn });
    Reflect.defineMetadata(FILTERABLE_FIELD_KEY, data, target.constructor);

    return Field(returnType, typeOptions)(target, propertyKey, descriptor);
  };
}
