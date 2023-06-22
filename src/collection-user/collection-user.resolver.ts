import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CollectionUserService } from './collection-user.service';
import { CollectionUserEntity } from './entities/collection-user.entity';
import { CreateCollectionUserInput } from './dto/create-collection-user.input';
import { UpdateCollectionUserInput } from './dto/update-collection-user.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CollectionEntity } from '../collection/entities/collection.entity';
import { GetCollectionsUsersArgs } from './dto/get-collections-users.args';
import { PaginatedCollectionsUsers } from './dto/paginated-collections-users';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => CollectionUserEntity)
export class CollectionUserResolver {
  constructor(private readonly collectionUserService: CollectionUserService) {}

  @Mutation(() => CollectionUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  createCollectionUser(
    @Args('input') input: CreateCollectionUserInput,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.collectionUserService.create({
      ...input,
      userId: currentUser.id,
    });
  }

  @Query(() => PaginatedCollectionsUsers)
  async getCollectionsUsers(
    @Args() { sort, filter, ...pagination }: GetCollectionsUsersArgs,
  ) {
    const [data, count] = await Promise.all([
      this.collectionUserService.readMany(pagination, sort, filter),
      this.collectionUserService.count(filter),
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

  @Query(() => CollectionUserEntity)
  getCollectionUser(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.collectionUserService.readOne(collectionId, userId);
  }

  @Mutation(() => CollectionUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  updateCollectionUser(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('userId', ParseUUIDPipe) userId: string,
    @Args('input') input: UpdateCollectionUserInput,
  ) {
    return this.collectionUserService.update(collectionId, userId, input);
  }

  @Mutation(() => CollectionUserEntity)
  @UseGuards(GqlJwtAuthGuard)
  deleteCollectionUser(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.collectionUserService.delete(collectionId, userId);
  }

  @ResolveField(() => CollectionEntity)
  collection(
    @Parent() collectionUser: CollectionUserEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(CollectionEntity, 'id')
      .load(collectionUser.collectionId);
  }

  @ResolveField(() => UserEntity)
  user(
    @Parent() collectionUser: CollectionUserEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(UserEntity, 'id')
      .load(collectionUser.userId);
  }
}
