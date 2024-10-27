import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CollectionEntity } from '../collection/entities/collection.entity';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CollectionReviewService } from './collection-review.service';
import { CollectionReviewEntity } from './entities/collection-review.entity';
import { CreateCollectionReviewInput } from './dto/create-collection-review.input';
import { UpdateCollectionReviewInput } from './dto/update-collection-review.input';
import {
  GetCollectionsReviewsOffsetArgs,
  GetCollectionsReviewsRelayArgs,
} from './dto/get-collections-reviews.args';
import {
  OffsetPaginatedCollectionsReviews,
  RelayPaginatedCollectionsReviews,
} from './dto/paginated-collections-reviews';

@Resolver(() => CollectionReviewEntity)
export class CollectionReviewResolver {
  constructor(private readonly reviewService: CollectionReviewService) {}

  @Mutation(() => CollectionReviewEntity)
  @UseGuards(GqlJwtAuthGuard)
  createCollectionReview(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('input') createReviewInput: CreateCollectionReviewInput,
  ) {
    createReviewInput.userId = currentUser.id;
    return this.reviewService.create(createReviewInput);
  }

  @Query(() => RelayPaginatedCollectionsReviews)
  async getCollectionsReviewsRelay(
    @Args() { sort, filter, ...pagination }: GetCollectionsReviewsRelayArgs,
  ): Promise<RelayPaginatedCollectionsReviews> {
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

  @Query(() => OffsetPaginatedCollectionsReviews)
  async getCollectionsReviewsOffset(
    @Args() { sort, filter, ...pagination }: GetCollectionsReviewsOffsetArgs,
  ): Promise<OffsetPaginatedCollectionsReviews> {
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

  @Query(() => CollectionReviewEntity)
  getCollectionReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.readOne(id);
  }

  @Query(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  hasCollectionReview(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewService.exists({
      collectionId,
      userId: user.id,
    });
  }

  @Mutation(() => CollectionReviewEntity)
  @UseGuards(GqlJwtAuthGuard)
  updateCollectionReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateReviewInput: UpdateCollectionReviewInput,
  ) {
    return this.reviewService.update(id, updateReviewInput);
  }

  @Mutation(() => CollectionReviewEntity)
  @UseGuards(GqlJwtAuthGuard)
  deleteCollectionReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.delete(id);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() review: CollectionReviewEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(UserEntity, 'id')
      .load(review.userId);
  }

  @ResolveField(() => CollectionEntity)
  collection(
    @Parent() review: CollectionReviewEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(CollectionEntity, 'id')
      .load(review.collectionId);
  }
}
