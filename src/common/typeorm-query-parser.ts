import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { FilterComparisonType, FilterType } from './filter';
import { GqlOffsetPagination } from './pagination';
import {
  SortDirectionEnum,
  SortNullsEnum,
  SortOptionsType,
  SortType,
} from './sort';

const handleFieldFilter = (
  where: WhereExpressionBuilder,
  fieldName: string,
  filter: FilterComparisonType<any>,
  operator: 'and' | 'or',
) => {
  const operatorProp = operator === 'and' ? 'andWhere' : 'orWhere';

  Object.entries(filter).forEach((filterProp) => {
    const [filterName, value] = filterProp;

    switch (filterName) {
      case 'eq': {
        where[operatorProp](`"${fieldName}" = :${fieldName}EqValue`, {
          [`${fieldName}EqValue`]: value,
        });
        break;
      }
      case 'neq': {
        where[operatorProp](`"${fieldName}" != :${fieldName}NEqValue`, {
          [`${fieldName}NEqValue`]: value,
        });
        break;
      }
      case 'gt': {
        where[operatorProp](`"${fieldName}" > :${fieldName}GtValue`, {
          [`${fieldName}GtValue`]: value,
        });
        break;
      }
      case 'gte': {
        where[operatorProp](`"${fieldName}" >= :${fieldName}GteValue`, {
          [`${fieldName}GteValue`]: value,
        });
        break;
      }
      case 'lt': {
        where[operatorProp](`"${fieldName}" < :${fieldName}LtValue`, {
          [`${fieldName}LtValue`]: value,
        });
        break;
      }
      case 'lte': {
        where[operatorProp](`"${fieldName}" <= :${fieldName}LteValue`, {
          [`${fieldName}LteValue`]: value,
        });
        break;
      }
      case 'like': {
        where[operatorProp](`"${fieldName}" LIKE :${fieldName}LikeValue`, {
          [`${fieldName}LikeValue`]: `%${value}%`,
        });
        break;
      }
      case 'nlike': {
        where[operatorProp](`"${fieldName}" NOT LIKE :${fieldName}NLikeValue`, {
          [`${fieldName}NLikeValue`]: `%${value}%`,
        });
        break;
      }
      case 'ilike': {
        where[operatorProp](`"${fieldName}" ILIKE :${fieldName}ILikeValue`, {
          [`${fieldName}ILikeValue`]: `%${value}%`,
        });
        break;
      }
      case 'nilike': {
        where[operatorProp](
          `"${fieldName}" NOT ILIKE :${fieldName}NILikeValue`,
          {
            [`${fieldName}NILikeValue`]: `%${value}%`,
          },
        );
        break;
      }
      case 'in': {
        where[operatorProp](`"${fieldName}" IN (:...${fieldName}InValue)`, {
          [`${fieldName}InValue`]: value,
        });
        break;
      }
      case 'nin': {
        where[operatorProp](
          `"${fieldName}" NOT IN (:...${fieldName}NInValue)`,
          {
            [`${fieldName}NInValue`]: value,
          },
        );
        break;
      }
      case 'btwn': {
        where[operatorProp](
          `"${fieldName}" BETWEEN :${fieldName}BtwnStart AND :${fieldName}BtwnEnd`,
          {
            [`${fieldName}BtwnStart`]: value.start,
            [`${fieldName}BtwnEnd`]: value.end,
          },
        );
        break;
      }
      case 'nbtwn': {
        where[operatorProp](
          `"${fieldName}" NOT BETWEEN :${fieldName}NBtwnStart AND :${fieldName}NBtwnEnd`,
          {
            [`${fieldName}NBtwnStart`]: value.start,
            [`${fieldName}NBtwnEnd`]: value.end,
          },
        );
        break;
      }
    }
  });
};

const handleFilterTreeLevel = (
  where: WhereExpressionBuilder,
  filter: FilterType<any>,
  operator: 'or' | 'and',
) => {
  Object.keys(filter).forEach((key) => {
    if (key === 'and') {
      where.andWhere(
        new Brackets((qb) =>
          filter[key].forEach((q) => handleFilterTreeLevel(qb, q, 'and')),
        ),
      );
    } else if (key === 'or') {
      where.andWhere(
        new Brackets((qb) =>
          filter[key].forEach((q) => handleFilterTreeLevel(qb, q, 'or')),
        ),
      );
    } else {
      handleFieldFilter(where, key, filter[key], operator);
    }
  });
};

export const parseFilter = <T>(
  query: SelectQueryBuilder<T>,
  filter: FilterType<T>,
) => {
  handleFilterTreeLevel(query, filter, 'and');
  return query;
};

export const parsePagination = <T>(
  query: SelectQueryBuilder<T>,
  pagination?: GqlOffsetPagination,
) => {
  query.take(pagination.take);
  query.skip(pagination.skip);
  return query;
};

const handleFieldSort = (
  query: SelectQueryBuilder<any>,
  fieldName: string,
  sortOptions: SortOptionsType,
) => {
  const direction =
    sortOptions.direction === SortDirectionEnum.ASC ||
    sortOptions.direction === SortDirectionEnum.asc
      ? 'ASC'
      : sortOptions.direction === SortDirectionEnum.DESC ||
        sortOptions.direction === SortDirectionEnum.desc
      ? 'DESC'
      : undefined;

  const nulls =
    sortOptions.nulls === SortNullsEnum.FIRST ||
    sortOptions.nulls === SortNullsEnum.first
      ? 'NULLS FIRST'
      : sortOptions.nulls === SortNullsEnum.LAST ||
        sortOptions.nulls === SortNullsEnum.last
      ? 'NULLS LAST'
      : undefined;

  query.addOrderBy(`"${fieldName}"`, direction, nulls);
};

export const parseSort = <T>(
  query: SelectQueryBuilder<T>,
  sort: SortType<T>,
) => {
  Object.keys(sort).forEach((key) => {
    handleFieldSort(query, key, sort[key]);
  });
};

export const parseArgs = <T>(
  query: SelectQueryBuilder<T>,
  pagination?: GqlOffsetPagination,
  sort?: SortType<T>,
  filter?: FilterType<T>,
) => {
  if (pagination) {
    parsePagination(query, pagination);
  }
  if (filter) {
    parseFilter(query, filter);
  }
  if (sort) {
    parseSort(query, sort);
  }
  return query;
};
