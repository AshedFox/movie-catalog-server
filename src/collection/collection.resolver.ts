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
import { ImageEntity } from '../image/entities/image.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { PaginatedCollections } from './dto/paginated-collections';
import { MovieEntity } from '../movie/entities/movie.entity';
import { GetCollectionsArgs } from './dto/get-collections.args';

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

  @ResolveField(() => ImageEntity, { nullable: true })
  cover(
    @Parent() collection: CollectionEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return collection.coverId
      ? loaders.imageLoader.load(collection.coverId)
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
