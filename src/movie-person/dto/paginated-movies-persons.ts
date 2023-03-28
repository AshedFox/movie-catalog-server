import { Paginated } from '@common/pagination/offset';
import { ObjectType } from '@nestjs/graphql';
import { MoviePersonEntity } from '../entities/movie-person.entity';

@ObjectType()
export class PaginatedMoviesPersons extends Paginated(MoviePersonEntity) {}
