import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { MovieUserEntity } from '../entities/movie-user.entity';

@ObjectType()
export class PaginatedMoviesUsers extends Paginated(MovieUserEntity) {}
