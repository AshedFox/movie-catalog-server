import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { Repository } from 'typeorm';
import { CountryEntity } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class CountryService extends BaseService<
  CountryEntity,
  CreateCountryInput,
  UpdateCountryInput
> {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {
    super(countryRepository);
  }
}
