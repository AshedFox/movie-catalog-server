import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { MoviePersonEntity } from '../entities/movie-person.entity';

@ObjectType()
export class PaginatedMoviesPersons extends Paginated(MoviePersonEntity) {}
