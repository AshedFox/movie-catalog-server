import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { MovieReviewEntity } from '../entities/movie-review.entity';

@ObjectType()
export class PaginatedMoviesReviews extends Paginated(MovieReviewEntity) {}
