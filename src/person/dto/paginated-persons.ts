import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { PersonEntity } from '../entities/person.entity';

@ObjectType()
export class PaginatedPersons extends Paginated(PersonEntity) {}
