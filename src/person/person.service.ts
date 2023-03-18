import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonEntity } from './entities/person.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class PersonService extends BaseService<
  PersonEntity,
  CreatePersonInput,
  UpdatePersonInput
> {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly personRepository: Repository<PersonEntity>,
  ) {
    super(personRepository);
  }
}
