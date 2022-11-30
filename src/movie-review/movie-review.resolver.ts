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
import { MovieReviewService } from './movie-review.service';
import { MovieReviewEntity } from './entities/movie-review.entity';
import { CreateMovieReviewInput } from './dto/create-movie-review.input';
import { UpdateMovieReviewInput } from './dto/update-movie-review.input';
import { GetMoviesReviewsArgs } from './dto/get-movies-reviews.args';
import { PaginatedMoviesReviews } from './dto/paginated-movies-reviews';
import { UserEntity } from '../user/entities/user.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MovieEntity } from '../movie/entities/movie.entity';

@Resolver(() => MovieReviewEntity)
export class MovieReviewResolver {
  constructor(private readonly reviewService: MovieReviewService) {}

  @Mutation(() => MovieReviewEntity)
  createMovieReview(@Args('input') createReviewInput: CreateMovieReviewInput) {
    return this.reviewService.create(createReviewInput);
  }

  @Query(() => PaginatedMoviesReviews)
  getMoviesReviews(@Args() { pagination, sort, filter }: GetMoviesReviewsArgs) {
    return this.reviewService.readMany(pagination, sort, filter);
  }

  @Query(() => MovieReviewEntity)
  getMovieReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.readOne(id);
  }

  @Mutation(() => MovieReviewEntity)
  updateMovieReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateReviewInput: UpdateMovieReviewInput,
  ) {
    return this.reviewService.update(id, updateReviewInput);
  }

  @Mutation(() => Boolean)
  deleteMovieReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.delete(id);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() review: MovieReviewEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.userLoader.load(review.userId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() review: MovieReviewEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(review.movieId);
  }
}
