import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { CurrencyEntity } from './entities/currency.entity';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { PaginatedCurrencies } from './dto/paginated-currencies';
import { UpdateCurrencyInput } from './dto/update-currency.input';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}

  create = async (
    createCurrencyInput: CreateCurrencyInput,
  ): Promise<CurrencyEntity> => {
    const { symbol, code } = createCurrencyInput;

    const currency = await this.currencyRepository.findOneBy([
      { code },
      { symbol },
    ]);

    if (currency) {
      throw new AlreadyExistsError(
        `Currency with code "${code}" or symbol "${symbol}" already exists!`,
      );
    }

    return this.currencyRepository.save(createCurrencyInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<CurrencyEntity>,
    filter?: FilterType<CurrencyEntity>,
  ): Promise<PaginatedCurrencies> => {
    const qb = parseArgsToQuery(
      this.currencyRepository,
      pagination,
      sort,
      filter,
    );

    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();
    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyByIds = async (ids: number[]): Promise<CurrencyEntity[]> =>
    this.currencyRepository.findBy({ id: In(ids) });

  readOne = async (id: number): Promise<CurrencyEntity> => {
    const currency = await this.currencyRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundError(`Currency with id "${id}" not found!`);
    }
    return currency;
  };

  update = async (
    id: number,
    updateCurrencyInput: UpdateCurrencyInput,
  ): Promise<CurrencyEntity> => {
    const currency = await this.currencyRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundError(`Currency with id "${id}" not found!`);
    }
    return this.currencyRepository.save({
      ...currency,
      ...updateCurrencyInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const currency = await this.currencyRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundError(`Currency with id "${id}" not found!`);
    }
    await this.currencyRepository.delete(id);
    return true;
  };
}
