import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination';
import { MoviePersonEntity } from '../entities/movie-person.entity';

@ObjectType()
export class PaginatedMoviesPersons extends Paginated(MoviePersonEntity) {}
