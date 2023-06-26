import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { Connection, Edge } from '@common/pagination/relay';
import { MovieEntity } from '../entities/movie.entity';

@ObjectType()
export class OffsetPaginatedMovies extends Paginated(MovieEntity) {}

@ObjectType()
export class RelayMovieEdge extends Edge(MovieEntity) {}

@ObjectType()
export class RelayPaginatedMovies extends Connection(
  RelayMovieEdge,
  MovieEntity,
) {}
