import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { CurrencyEntity } from './entities/currency.entity';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { UpdateCurrencyInput } from './dto/update-currency.input';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class CurrencyService extends BaseService<
  CurrencyEntity,
  CreateCurrencyInput,
  UpdateCurrencyInput
> {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {
    super(currencyRepository);
  }

  create = async (
    createCurrencyInput: CreateCurrencyInput,
  ): Promise<CurrencyEntity> => {
    const { id } = createCurrencyInput;

    const currency = await this.currencyRepository.findOneBy([{ id }]);

    if (currency) {
      throw new AlreadyExistsError(`Currency with id "${id}" already exists!`);
    }

    return this.currencyRepository.save(createCurrencyInput);
  };
}
