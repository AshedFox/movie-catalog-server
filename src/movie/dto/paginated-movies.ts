import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination';
import { MovieEntity } from '../entities/movie.entity';

@ObjectType()
export class PaginatedMovies extends Paginated(MovieEntity) {}
