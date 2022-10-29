import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonEntity } from './entities/person.entity';
import { In, Repository } from 'typeorm';
import { PaginatedPersons } from './dto/paginated-persons';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { GqlOffsetPagination } from '../common/pagination';
import { SortType } from '../common/sort';
import { FilterType } from '../common/filter';
import { parseArgs } from '../common/typeorm-query-parser';

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
    pagination?: GqlOffsetPagination,
    sort?: SortType<PersonEntity>,
    filter?: FilterType<PersonEntity>,
  ): Promise<PaginatedPersons> => {
    const qb = parseArgs(
      this.personRepository.createQueryBuilder(),
      pagination,
      sort,
      filter,
    );
    const [data, count] = await qb.getManyAndCount();

    return { data, count, hasNext: count > pagination.take + pagination.skip };
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
