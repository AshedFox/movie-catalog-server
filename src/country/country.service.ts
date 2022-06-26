import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { Repository } from 'typeorm';
import { CountryModel } from './entities/country.model';
import { NotFoundError } from '../shared/errors/not-found.error';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryModel)
    private readonly countryRepository: Repository<CountryModel>,
  ) {}

  async create(createCountryInput: CreateCountryInput): Promise<CountryModel> {
    return this.countryRepository.save(createCountryInput);
  }

  async readAll(): Promise<CountryModel[]> {
    return this.countryRepository.find();
  }

  async readAllByIds(ids: number[]): Promise<CountryModel[]> {
    return this.countryRepository.findByIds(ids);
  }

  async readOne(id: number): Promise<CountryModel> {
    const country = await this.countryRepository.findOne(id);
    if (!country) {
      throw new NotFoundError(`Country with id "${id}" not found`);
    }
    return country;
  }

  async update(
    id: number,
    updateCountryInput: UpdateCountryInput,
  ): Promise<CountryModel> {
    const country = await this.countryRepository.findOne(id);
    if (!country) {
      throw new NotFoundError();
    }
    return this.countryRepository.save({ ...country, ...updateCountryInput });
  }

  async delete(id: number): Promise<boolean> {
    const country = await this.countryRepository.findOne(id);
    if (!country) {
      throw new NotFoundError();
    }
    await this.countryRepository.delete(id);
    return true;
  }
}
