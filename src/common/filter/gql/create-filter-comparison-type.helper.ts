import { Type } from '@nestjs/common';
import { FilterStorage } from './filter-storage.type';
import {
  Field,
  InputType,
  ReturnTypeFuncValue,
  TypeMetadataStorage,
} from '@nestjs/graphql';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type as TypeDecorator } from 'class-transformer';
import { BetweenType, FilterType, UniversalFilter } from '../common';
import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';
import { capitalize } from '../../../utils/capitalize.helper';
import { hasName } from '../../../utils/has-name.helper';

const getFilterName = (type: ReturnTypeFuncValue): string => {
  if (hasName(type)) {
    return `${capitalize(type.name)}Filter`;
  } else {
    return `${capitalize(
      TypeMetadataStorage.getEnumsMetadata().find((o) => o.ref === type).name,
    )}Filter`;
  }
  //throw new Error('...');
};

export function createFilterComparisonType<T>(
  classRef: Type<T>,
  returnTypeFunc: ReturnTypeFunc,
) {
  const fieldType = returnTypeFunc ? returnTypeFunc() : classRef;
  const filterName = getFilterName(fieldType);
  const ExistingFilter = FilterStorage.get(filterName);
  if (ExistingFilter) {
    return ExistingFilter as Type<FilterType<T>>;
  }

  @InputType(`${filterName}Between`)
  class Between implements BetweenType<T> {
    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    end?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    start?: T;
  }

  @InputType(filterName)
  class GqlFilterType implements UniversalFilter<T> {
    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    eq?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    neq?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    gt?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    gte?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    lt?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    lte?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    like?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    nlike?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    ilike?: T;

    @Field(() => fieldType, { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    nilike?: T;

    @Field(() => [fieldType], { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    in?: T[];

    @Field(() => [fieldType], { nullable: true })
    @IsOptional()
    @TypeDecorator(() => classRef)
    nin?: T[];

    @Field(() => Between, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @TypeDecorator(() => Between)
    btwn?: BetweenType<T>;

    @Field(() => Between, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @TypeDecorator(() => Between)
    nbtwn?: BetweenType<T>;
  }

  FilterStorage.set(filterName, GqlFilterType);

  return GqlFilterType as Type<FilterType<T>>;
}
