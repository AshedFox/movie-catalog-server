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
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';

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

  @Query(() => PaginatedMoviesReviews)
  async getMoviesReviews(
    @Args() { sort, filter, ...pagination }: GetMoviesReviewsArgs,
  ): Promise<PaginatedMoviesReviews> {
    const data = await this.reviewService.readMany(pagination, sort, filter);

    const { first, last } = pagination;

    let edges = data.map((node) => ({
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
