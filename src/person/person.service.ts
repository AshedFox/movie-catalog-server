import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonModel } from './entities/person.model';
import { ILike } from 'typeorm';
import { PaginatedPersons } from './dto/paginated-persons.result';

@Injectable()
export class PersonService {
  async create(createPersonInput: CreatePersonInput): Promise<PersonModel> {
    const person = await PersonModel.create(createPersonInput);
    return person.save();
  }

  async readAll(
    name: string,
    take: number,
    skip: number,
  ): Promise<PaginatedPersons> {
    const [data, count] = await PersonModel.findAndCount({
      where: [
        name
          ? {
              name: ILike(`%${name}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readOne(id: number): Promise<PersonModel> {
    return PersonModel.findOne(id);
  }

  async update(
    id: number,
    updatePersonInput: UpdatePersonInput,
  ): Promise<PersonModel> {
    await PersonModel.update(id, updatePersonInput);
    return PersonModel.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    return !!(await PersonModel.delete(id));
  }
}
