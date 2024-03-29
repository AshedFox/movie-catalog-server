import {
  Brackets,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { FilterComparisonType, FilterType } from './filter';
import { PaginationArgsType } from './pagination';
import {
  SortDirectionEnum,
  SortNullsEnum,
  SortOptionsType,
  SortType,
} from './sort';
import { snakeCase } from 'typeorm/util/StringUtils';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ArgsType } from '@common/args';
import { OffsetPaginationArgsType } from './pagination/offset';
import { RelayPaginationArgsType } from './pagination/relay';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

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

  Object.entries(filter).forEach((filterProp) => {
    const [filterName, value] = filterProp;

    if (value === null) {
      switch (filterName) {
        case 'eq': {
          where[operatorProp](`${snakeName} IS NULL`);
          break;
        }
        case 'neq': {
          where[operatorProp](`${snakeName} IS NOT NULL`);
          break;
        }
        default: {
          applyFieldFilter(
            where,
            filterName,
            filter[filterName],
            operator,
            fieldName,
          );
        }
      }
    } else {
      switch (filterName) {
        case 'eq': {
          where[operatorProp](`${snakeName} = :${name}EqValue`, {
            [`${name}EqValue`]: value,
          });
          break;
        }
        case 'neq': {
          where[operatorProp](`${snakeName} != :${name}NEqValue`, {
            [`${name}NEqValue`]: value,
          });
          break;
        }
        case 'gt': {
          where[operatorProp](`${snakeName} > :${name}GtValue`, {
            [`${name}GtValue`]: value,
          });
          break;
        }
        case 'gte': {
          where[operatorProp](`${snakeName} >= :${name}GteValue`, {
            [`${name}GteValue`]: value,
          });
          break;
        }
        case 'lt': {
          where[operatorProp](`${snakeName} < :${name}LtValue`, {
            [`${name}LtValue`]: value,
          });
          break;
        }
        case 'lte': {
          where[operatorProp](`${snakeName} <= :${name}LteValue`, {
            [`${name}LteValue`]: value,
          });
          break;
        }
        case 'like': {
          where[operatorProp](`${snakeName} LIKE :${name}LikeValue`, {
            [`${name}LikeValue`]: `%${value}%`,
          });
          break;
        }
        case 'nlike': {
          where[operatorProp](`${snakeName} NOT LIKE :${name}NLikeValue`, {
            [`${name}NLikeValue`]: `%${value}%`,
          });
          break;
        }
        case 'ilike': {
          where[operatorProp](`${snakeName} ILIKE :${name}ILikeValue`, {
            [`${name}ILikeValue`]: `%${value}%`,
          });
          break;
        }
        case 'nilike': {
          where[operatorProp](`${snakeName} NOT ILIKE :${name}NILikeValue`, {
            [`${name}NILikeValue`]: `%${value}%`,
          });
          break;
        }
        case 'in': {
          where[operatorProp](`${snakeName} IN (:...${name}InValue)`, {
            [`${name}InValue`]: value,
          });
          break;
        }
        case 'nin': {
          where[operatorProp](`${snakeName} NOT IN (:...${name}NInValue)`, {
            [`${name}NInValue`]: value,
          });
          break;
        }
        case 'btwn': {
          where[operatorProp](
            `${snakeName} BETWEEN :${name}BtwnStart AND :${name}BtwnEnd`,
            {
              [`${name}BtwnStart`]: value.start,
              [`${name}BtwnEnd`]: value.end,
            },
          );
          break;
        }
        case 'nbtwn': {
          where[operatorProp](
            `${snakeName} NOT BETWEEN :${name}NBtwnStart AND :${name}NBtwnEnd`,
            {
              [`${name}NBtwnStart`]: value.start,
              [`${name}NBtwnEnd`]: value.end,
            },
          );
          break;
        }
        default: {
          applyFieldFilter(
            where,
            filterName,
            filter[filterName],
            operator,
            fieldName,
          );
        }
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
  qb.limit(pagination.limit);
  qb.offset(pagination.offset);
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
    qb.addOrderBy(idFieldName, 'ASC');
    qb.limit(first + 1);
  } else if (last) {
    if (before) {
      qb.andWhere(`${idFieldName} < :before`, { before });
    }
    qb.addOrderBy(idFieldName, 'DESC');
    qb.limit(last + 1);
  }
};

export const applyPagination = <T>(
  qb: SelectQueryBuilder<T>,
  pagination: PaginationArgsType,
  alias?: string,
) => {
  if (isOffsetPagination(pagination)) {
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

  const direction =
    options.direction === SortDirectionEnum.ASC ||
    options.direction === SortDirectionEnum.asc
      ? 'ASC'
      : options.direction === SortDirectionEnum.DESC ||
        options.direction === SortDirectionEnum.desc
      ? 'DESC'
      : undefined;

  const nulls =
    options.nulls === SortNullsEnum.FIRST ||
    options.nulls === SortNullsEnum.first
      ? 'NULLS FIRST'
      : options.nulls === SortNullsEnum.LAST ||
        options.nulls === SortNullsEnum.last
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

function isOffsetPagination(
  pagination: PaginationArgsType,
): pagination is OffsetPaginationArgsType {
  return (pagination as OffsetPaginationArgsType).offset !== undefined;
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
