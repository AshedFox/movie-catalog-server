import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { In, Repository } from 'typeorm';
import { CountryEntity } from './entities/country.entity';
import { NotFoundError } from '../utils/errors/not-found.error';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  create = async (
    createCountryInput: CreateCountryInput,
  ): Promise<CountryEntity> => this.countryRepository.save(createCountryInput);

  readMany = async (): Promise<CountryEntity[]> =>
    this.countryRepository.find();

  readManyByIds = async (ids: number[]): Promise<CountryEntity[]> =>
    this.countryRepository.findBy({ id: In(ids) });

  readOne = async (id: number): Promise<CountryEntity> => {
    const country = await this.countryRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundError(`Country with id "${id}" not found!`);
    }
    return country;
  };

  update = async (
    id: number,
    updateCountryInput: UpdateCountryInput,
  ): Promise<CountryEntity> => {
    const country = await this.countryRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundError(`Country with id "${id}" not found!`);
    }
    return this.countryRepository.save({ ...country, ...updateCountryInput });
  };

  delete = async (id: number): Promise<boolean> => {
    const country = await this.countryRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundError(`Country with id "${id}" not found!`);
    }
    await this.countryRepository.delete(id);
    return true;
  };
}
