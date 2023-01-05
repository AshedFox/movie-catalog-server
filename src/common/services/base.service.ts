import { DeepPartial, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

export abstract class BaseService<
  T,
  C extends DeepPartial<T>,
  U extends DeepPartial<T>,
> {
  protected constructor(private readonly repository: Repository<T>) {}

  count = async (filter?: FilterType<T>): Promise<number> => {
    return parseArgsToQuery(
      this.repository,
      undefined,
      undefined,
      filter,
    ).getCount();
  };

  create = async (input: C): Promise<T> => {
    try {
      return this.repository.save(input);
    } catch {
      throw new AlreadyExistsError(`${this.repository.target} already exists!`);
    }
  };

  readOne = async (id: string | number): Promise<T> => {
    const entity = await this.repository
      .createQueryBuilder()
      .whereInIds(id)
      .getOne();

    if (!entity) {
      throw new NotFoundError(
        `${this.repository.target} with id ${id} not found!`,
      );
    }

    return entity;
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<T>,
    filter?: FilterType<T>,
  ): Promise<T[]> => {
    return parseArgsToQuery(
      this.repository,
      pagination,
      sort,
      filter,
    ).getMany();
  };

  readManyByIds = async (ids: (number | string)[]): Promise<T[]> => {
    return this.repository.createQueryBuilder().whereInIds(ids).getMany();
  };

  update = async (id: string | number, input: U): Promise<T> => {
    if (this.repository.hasId(input as T)) {
      throw new Error('Could not specify id in update input!');
    }

    const entity = await this.readOne(id);

    return this.repository.save({
      ...entity,
      ...input,
    });
  };

  delete = async (id: string | number): Promise<T> => {
    const entity = await this.readOne(id);
    return this.repository.remove(entity);
  };
}
