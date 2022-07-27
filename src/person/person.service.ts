import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonModel } from './entities/person.model';
import { ILike, In, Repository } from 'typeorm';
import { PaginatedPersons } from './dto/paginated-persons.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(PersonModel)
    private readonly personRepository: Repository<PersonModel>,
  ) {}

  async create(createPersonInput: CreatePersonInput): Promise<PersonModel> {
    return this.personRepository.save(createPersonInput);
  }

  async readAll(
    take: number,
    skip: number,
    name?: string,
  ): Promise<PaginatedPersons> {
    const [data, count] = await this.personRepository.findAndCount({
      where: {
        name: name ? ILike(`%${name}%`) : undefined,
      },
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  }

  async readAllByIds(ids: number[]): Promise<PersonModel[]> {
    return await this.personRepository.findBy({ id: In(ids) });
  }

  async readOne(id: number): Promise<PersonModel> {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundError();
    }
    return person;
  }

  async update(
    id: number,
    updatePersonInput: UpdatePersonInput,
  ): Promise<PersonModel> {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundError();
    }
    return this.personRepository.save({
      ...person,
      ...updatePersonInput,
    });
  }

  async delete(id: number): Promise<boolean> {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundError();
    }
    await this.personRepository.remove(person);
    return true;
  }
}
