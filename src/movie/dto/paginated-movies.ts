import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { MovieEntity } from '../entities/movie.entity';

@ObjectType()
export class PaginatedMovies extends Paginated(MovieEntity) {}
