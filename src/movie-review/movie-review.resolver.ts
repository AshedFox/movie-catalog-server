import {
  Args,
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
import {
  GetMoviesReviewsOffsetArgs,
  GetMoviesReviewsRelayArgs,
} from './dto/get-movies-reviews.args';
import {
  OffsetPaginatedMoviesReviews,
  RelayPaginatedMoviesReviews,
} from './dto/paginated-movies-reviews';
import { UserEntity } from '../user/entities/user.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => MovieReviewEntity)
export class MovieReviewResolver {
  constructor(private readonly reviewService: MovieReviewService) {}

  @Mutation(() => MovieReviewEntity)
  @UseGuards(GqlJwtAuthGuard)
  createMovieReview(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('input') createReviewInput: CreateMovieReviewInput,
  ) {
    createReviewInput.userId = currentUser.id;
    return this.reviewService.create(createReviewInput);
  }

  @Query(() => RelayPaginatedMoviesReviews)
  async getMoviesReviewsRelay(
    @Args() { sort, filter, ...pagination }: GetMoviesReviewsRelayArgs,
  ): Promise<RelayPaginatedMoviesReviews> {
    const data = await this.reviewService.readMany(pagination, sort, filter);

    const { first, last } = pagination;

    const edges = data.map((node) => ({
      node,
      cursor: String(node.id),
    }));

    if ((!last && data.length > first) || (!first && data.length > last)) {
      edges.pop();
    }

    return {
      edges: !!last ? edges.reverse() : edges,
      pageInfo: {
        hasNextPage: !last && data.length > first,
        hasPreviousPage: !first && data.length > last,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
    };
  }

  @Query(() => OffsetPaginatedMoviesReviews)
  async getMoviesReviewsOffset(
    @Args() { sort, filter, ...pagination }: GetMoviesReviewsOffsetArgs,
  ): Promise<OffsetPaginatedMoviesReviews> {
    const [data, count] = await Promise.all([
      this.reviewService.readMany(pagination, sort, filter),
      this.reviewService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => MovieReviewEntity)
  getMovieReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.readOne(id);
  }

  @Mutation(() => MovieReviewEntity)
  @UseGuards(GqlJwtAuthGuard)
  updateMovieReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateReviewInput: UpdateMovieReviewInput,
  ) {
    return this.reviewService.update(id, updateReviewInput);
  }

  @Mutation(() => MovieReviewEntity)
  @UseGuards(GqlJwtAuthGuard)
  deleteMovieReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.delete(id);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() review: MovieReviewEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(UserEntity, 'id')
      .load(review.userId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() review: MovieReviewEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(review.movieId);
  }
}
