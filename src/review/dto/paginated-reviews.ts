import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { ReviewEntity } from '../entities/review.entity';

@ObjectType()
export class PaginatedReviews extends Paginated(ReviewEntity) {}
