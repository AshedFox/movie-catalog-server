import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { PersonEntity } from '../entities/person.entity';

@ObjectType()
export class PaginatedPersons extends Paginated(PersonEntity) {}
