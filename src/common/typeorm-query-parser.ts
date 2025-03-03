import {
  Brackets,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { FilterComparisonType, FilterType } from './filter';
import { PaginationArgsType } from './pagination';
import { SortOptionsType, SortType } from './sort';
import { snakeCase } from 'typeorm/util/StringUtils';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ArgsType } from '@common/args';
import { OffsetPaginationArgsType } from './pagination/offset';
import { RelayPaginationArgsType } from './pagination/relay';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

type Operators = {
  [key: string]: {
    withNull?: string;
    withValue?: string;
    valueTransform?: (value: any) => any;
  };
};

const FILTER_OPERATORS: Operators = {
  eq: { withNull: 'IS NULL', withValue: '= :value' },
  neq: { withNull: 'IS NOT NULL', withValue: '!= :value' },
  gt: { withValue: '> :value' },
  gte: { withValue: '>= :value' },
  lt: { withValue: '< :value' },
  lte: { withValue: '<= :value' },
  like: { withValue: 'LIKE :value', valueTransform: (v) => `%${v}%` },
  nlike: { withValue: 'NOT LIKE :value', valueTransform: (v) => `%${v}%` },
  ilike: { withValue: 'ILIKE :value', valueTransform: (v) => `%${v}%` },
  nilike: { withValue: 'NOT ILIKE :value', valueTransform: (v) => `%${v}%` },
  in: { withValue: 'IN (:...value)' },
  nin: { withValue: 'NOT IN (:...value)' },
  btwn: {
    withValue: 'BETWEEN :startValue AND :endValue',
    valueTransform: (v) => ({ startValue: v.start, endValue: v.end }),
  },
  nbtwn: {
    withValue: 'NOT BETWEEN :startValue AND :endValue',
    valueTransform: (v) => ({ startValue: v.start, endValue: v.end }),
  },
};

const applyFieldFilter = <T>(
  where: WhereExpressionBuilder,
  fieldName: string,
  filter: FilterComparisonType<T>,
  operator: 'and' | 'or',
  alias?: string,
) => {
  const operatorProp = operator === 'and' ? 'andWhere' : 'orWhere';
  const name = randomStringGenerator();
  const snakeName = alias
    ? `"${alias}"."${snakeCase(fieldName)}"`
    : `"${snakeCase(fieldName)}"`;

  Object.entries(filter).forEach(([filterName, value]) => {
    const filterOperator = FILTER_OPERATORS[filterName];

    if (!filterOperator) {
      return applyFieldFilter(
        where,
        filterName,
        filter[filterName],
        operator,
        fieldName,
      );
    }

    if (value === null) {
      if (filterOperator.withNull) {
        where[operatorProp](`${snakeName} ${filterOperator.withNull}`);
      }
      return;
    }

    if (filterOperator.withValue) {
      const transformedValue = filterOperator.valueTransform
        ? filterOperator.valueTransform(value)
        : value;

      if (filterName === 'btwn' || filterName === 'nbtwn') {
        where[operatorProp](`${snakeName} ${filterOperator.withValue}`, {
          [`${name}${filterName}Start`]: transformedValue.startValue,
          [`${name}${filterName}End`]: transformedValue.endValue,
        });
      } else {
        const paramName = `${name}${filterName}Value`;
        const withValue = filterOperator.withValue.replace(
          ':value',
          `:${paramName}`,
        );
        where[operatorProp](`${snakeName} ${withValue}`, {
          [paramName]: transformedValue,
        });
      }
    }
  });
};

const applyFilterTreeLevel = <T>(
  qb: WhereExpressionBuilder,
  filter: FilterType<T>,
  operator: 'or' | 'and',
  alias?: string,
) => {
  Object.keys(filter).forEach((key) => {
    if (key === 'and') {
      qb.andWhere(
        new Brackets((where) =>
          filter[key].forEach((q) =>
            applyFilterTreeLevel(where, q, 'and', alias),
          ),
        ),
      );
    } else if (key === 'or') {
      qb.orWhere(
        new Brackets((where) =>
          filter[key].forEach((q) =>
            applyFilterTreeLevel(where, q, 'or', alias),
          ),
        ),
      );
    } else {
      applyFieldFilter(qb, key, filter[key], operator, alias);
    }
  });
};

export const applyFilter = <T>(
  qb: SelectQueryBuilder<T>,
  filter: FilterType<T>,
  alias?: string,
) => {
  applyFilterTreeLevel(qb, filter, 'and', alias ?? qb.alias);
};

export const applyOffsetPagination = <T>(
  qb: SelectQueryBuilder<T>,
  pagination: OffsetPaginationArgsType,
) => {
  qb.limit(pagination.limit).offset(pagination.offset);
};

export const applyRelayPagination = <T>(
  qb: SelectQueryBuilder<T>,
  pagination: RelayPaginationArgsType,
  alias?: string,
) => {
  const { first, last, before, after } = pagination;
  const idFieldName = alias ? `"${alias}"."id"` : `"id"`;

  if (first) {
    if (after) {
      qb.andWhere(`${idFieldName} > :after`, { after });
    }
    qb.addOrderBy(idFieldName, 'ASC').limit(first + 1);
  } else if (last) {
    if (before) {
      qb.andWhere(`${idFieldName} < :before`, { before });
    }
    qb.addOrderBy(idFieldName, 'DESC').limit(last + 1);
  }
};

export const applyPagination = <T>(
  qb: SelectQueryBuilder<T>,
  pagination: PaginationArgsType,
  alias?: string,
) => {
  if ('offset' in pagination) {
    applyOffsetPagination(qb, pagination);
  } else {
    applyRelayPagination(qb, pagination, alias);
  }
};

const applyFieldSort = (
  qb: SelectQueryBuilder<any>,
  fieldName: string,
  options: SortOptionsType,
  alias?: string,
) => {
  const snakeName = alias
    ? `"${alias}"."${snakeCase(fieldName)}"`
    : `"${snakeCase(fieldName)}"`;

  if (!options?.direction && !options?.nulls) {
    return Object.keys(options).forEach((key) => {
      applyFieldSort(qb, key, options[key], fieldName);
    });
  }

  const direction = options.direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const nulls =
    options.nulls?.toUpperCase() === 'FIRST'
      ? 'NULLS FIRST'
      : options.nulls?.toUpperCase() === 'LAST'
        ? 'NULLS LAST'
        : undefined;

  qb.addOrderBy(snakeName, direction, nulls);
};

export const applySort = <T>(
  qb: SelectQueryBuilder<T>,
  sort: SortType<T>,
  alias?: string,
) => {
  Object.keys(sort).forEach((key) => {
    applyFieldSort(qb, key, sort[key], alias);
  });
};

const applyJoins = <T>(
  qb: SelectQueryBuilder<T>,
  relations: RelationMetadata[],
) => {
  relations.forEach((r) => {
    qb.leftJoinAndSelect(`${qb.alias}.${r.propertyName}`, r.propertyName);
  });
};

const getFilterRelations = (filter: FilterType<any>) => {
  const fields = new Map<string, string>();

  for (const filterKey in filter) {
    if (filterKey === 'and' || filterKey === 'or') {
      for (const el of filter[filterKey]) {
        const items = getFilterRelations(el);

        for (const item of items) {
          fields.set(item[0], item[1]);
        }
      }
    } else {
      fields.set(filterKey, filterKey);
    }
  }

  return fields;
};

const getRelations = <T>(
  relationsMeta: RelationMetadata[],
  filter: FilterType<T> = {},
  sort: SortType<T> = {},
) => {
  const fields = new Map<string, string>(getFilterRelations(filter));

  for (const sortKey in sort) {
    if (sortKey !== 'direction' && sortKey !== 'nulls') {
      fields.set(sortKey, sortKey);
    }
  }

  const keys = Array.from(fields.keys());

  return keys.length > 0
    ? relationsMeta.filter((r) => keys.includes(r.propertyName))
    : [];
};

export function parseArgsToQuery<T>(
  repo: Repository<T>,
  pagination?: PaginationArgsType,
  sort?: SortType<T>,
  filter?: FilterType<T>,
) {
  const relations = getRelations(repo.metadata.relations, filter, sort);

  const qb = repo.createQueryBuilder();

  applyJoins(qb, relations);

  if (sort) {
    applySort(qb, sort);
  }
  if (pagination) {
    applyPagination(qb, pagination);
  }
  if (filter) {
    applyFilter(qb, filter);
  }

  return qb;
}

export function applyArgs<T>(
  qb: SelectQueryBuilder<T>,
  args: ArgsType<T>,
  pagination?: PaginationArgsType,
  alias?: string,
) {
  const { filter, sort } = args;

  if (sort) {
    applySort(qb, sort, alias);
  }
  if (pagination) {
    applyPagination(qb, pagination);
  }
  if (filter) {
    applyFilter(qb, filter, alias);
  }

  return qb;
}

export default {
  applySort,
  applyFilter,
  applyPagination,
  applyArgs,
};
