import {
  Brackets,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { FilterComparisonType, FilterType } from './filter';
import { GqlOffsetPagination } from './pagination';
import {
  SortDirectionEnum,
  SortNullsEnum,
  SortOptionsType,
  SortType,
} from './sort';
import { snakeCase } from 'typeorm/util/StringUtils';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ArgsType } from '@common/args';

const applyFieldFilter = (
  where: WhereExpressionBuilder,
  fieldName: string,
  filter: FilterComparisonType<any>,
  operator: 'and' | 'or',
  alias?: string,
) => {
  const operatorProp = operator === 'and' ? 'andWhere' : 'orWhere';
  const name = alias ? `${alias}_${fieldName}` : fieldName;
  const snakeName = alias
    ? `"${alias}"."${snakeCase(fieldName)}"`
    : `"${snakeCase(fieldName)}"`;

  Object.entries(filter).forEach((filterProp) => {
    const [filterName, value] = filterProp;

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
  });
};

const applyFilterTreeLevel = <T>(
  qb: SelectQueryBuilder<T>,
  filter: FilterType<T>,
  operator: 'or' | 'and',
) => {
  Object.keys(filter).forEach((key) => {
    if (key === 'and') {
      qb.andWhere(
        new Brackets(() =>
          filter[key].forEach((q) => applyFilterTreeLevel(qb, q, 'and')),
        ),
      );
    } else if (key === 'or') {
      qb.andWhere(
        new Brackets(() =>
          filter[key].forEach((q) => applyFilterTreeLevel(qb, q, 'or')),
        ),
      );
    } else {
      applyFieldFilter(qb, key, filter[key], operator, qb.alias);
    }
  });
};

export const applyFilter = <T>(
  qb: SelectQueryBuilder<T>,
  filter: FilterType<T>,
) => {
  applyFilterTreeLevel(qb, filter, 'and');
};

export const applyPagination = <T>(
  qb: SelectQueryBuilder<T>,
  pagination: GqlOffsetPagination,
) => {
  qb.take(pagination.take);
  qb.skip(pagination.skip);
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

const getRelations = <T>(
  relationsMeta: RelationMetadata[],
  filter: FilterType<T> = {},
  sort: SortType<T> = {},
) => {
  const fields = [
    ...Object.keys(filter).filter((key) => key !== 'and' && key !== 'or'),
    ...Object.keys(sort).filter(
      (key) => key !== 'direction' && key !== 'nulls',
    ),
  ];

  return fields.length > 0
    ? relationsMeta.filter((r) => fields.includes(r.propertyName))
    : [];
};

export function parseArgsToQuery<T>(
  repo: Repository<T>,
  pagination?: GqlOffsetPagination,
  sort?: SortType<T>,
  filter?: FilterType<T>,
) {
  const relations = getRelations(repo.metadata.relations, filter, sort);

  const qb = repo.createQueryBuilder();

  applyJoins(qb, relations);

  if (filter) {
    applyFilter(qb, filter);
  }
  if (sort) {
    applySort(qb, sort);
  }
  if (pagination) {
    applyPagination(qb, pagination);
  }

  return qb;
}

export function applyArgs<T>(
  qb: SelectQueryBuilder<T>,
  args: ArgsType<T>,
  alias?: string,
) {
  const { filter, sort, pagination } = args;

  if (filter) {
    applyFilter(qb, filter);
  }
  if (sort) {
    applySort(qb, sort, alias);
  }
  if (pagination) {
    applyPagination(qb, pagination);
  }

  return qb;
}
