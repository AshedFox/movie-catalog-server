import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { PersonModel } from '../entities/person.model';

@ObjectType()
export class PaginatedPersons extends Paginated(PersonModel) {}
