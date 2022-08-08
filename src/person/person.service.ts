import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonEntity } from './entities/person.entity';
import { ILike, In, Repository } from 'typeorm';
import { PaginatedPersons } from './dto/paginated-persons';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly personRepository: Repository<PersonEntity>,
  ) {}

  create = async (
    createPersonInput: CreatePersonInput,
  ): Promise<PersonEntity> => this.personRepository.save(createPersonInput);

  readMany = async (
    take: number,
    skip: number,
    name?: string,
    countriesIds?: number[],
  ): Promise<PaginatedPersons> => {
    const [data, count] = await this.personRepository.findAndCount({
      where: {
        name: name ? ILike(`%${name}%`) : undefined,
        countryId: countriesIds ? In(countriesIds) : undefined,
      },
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  };

  readManyByIds = async (ids: number[]): Promise<PersonEntity[]> =>
    await this.personRepository.findBy({ id: In(ids) });

  readOne = async (id: number): Promise<PersonEntity> => {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundError(`Person with id "${id}" not found!`);
    }
    return person;
  };

  update = async (
    id: number,
    updatePersonInput: UpdatePersonInput,
  ): Promise<PersonEntity> => {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundError(`Person with id "${id}" not found!`);
    }
    return this.personRepository.save({
      ...person,
      ...updatePersonInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundError(`Person with id "${id}" not found!`);
    }
    await this.personRepository.remove(person);
    return true;
  };
}
