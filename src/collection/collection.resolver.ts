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
import { CollectionService } from './collection.service';
import { CollectionEntity } from './entities/collection.entity';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { MediaEntity } from '../media/entities/media.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { PaginatedCollections } from './dto/paginated-collections';
import { MovieEntity } from '../movie/entities/movie.entity';
import { GetCollectionsArgs } from './dto/get-collections.args';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => CollectionEntity)
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}

  @Mutation(() => CollectionEntity)
  createCollection(@Args('input') input: CreateCollectionInput) {
    return this.collectionService.create(input);
  }

  @Query(() => PaginatedCollections)
  getCollections(@Args() { sort, filter, pagination }: GetCollectionsArgs) {
    return this.collectionService.readMany(pagination, sort, filter);
  }

  @Query(() => CollectionEntity)
  getCollection(@Args('id', { type: () => Int }) id: number) {
    return this.collectionService.readOne(id);
  }

  @Mutation(() => CollectionEntity)
  updateCollection(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCollectionInput,
  ) {
    return this.collectionService.update(id, input);
  }

  @Mutation(() => CollectionEntity)
  deleteCollection(@Args('id', { type: () => Int }) id: number) {
    return this.collectionService.delete(id);
  }

  @ResolveField(() => MediaEntity, { nullable: true })
  cover(
    @Parent() collection: CollectionEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return collection.coverId
      ? loaders.mediaLoader.load(collection.coverId)
      : undefined;
  }

  @ResolveField(() => [MovieEntity])
  movies(
    @Parent() collection: CollectionEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.moviesByCollectionLoader.load(collection.id);
  }
}
