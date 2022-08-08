import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { GetReviewsArgs } from './dto/get-reviews.args';
import { PaginatedReviews } from './dto/paginated-reviews';
import { UserEntity } from '../user/entities/user.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MovieEntity } from '../movie/entities/movie.entity';

@Resolver(() => ReviewEntity)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => ReviewEntity)
  createReview(@Args('input') createReviewInput: CreateReviewInput) {
    return this.reviewService.create(createReviewInput);
  }

  @Query(() => PaginatedReviews)
  getReviews(@Args() { userId, movieId, take, skip }: GetReviewsArgs) {
    return this.reviewService.readMany(take, skip, userId, movieId);
  }

  @Query(() => ReviewEntity)
  getReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.readOne(id);
  }

  @Mutation(() => ReviewEntity)
  updateReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateReviewInput: UpdateReviewInput,
  ) {
    return this.reviewService.update(id, updateReviewInput);
  }

  @Mutation(() => Boolean)
  deleteReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.delete(id);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() review: ReviewEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.userLoader.load(review.userId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() review: ReviewEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(review.movieId);
  }
}
