import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '@utils/errors';
import { CollectionEntity } from './entities/collection.entity';
import { PaginatedCollections } from './dto/paginated-collections';
import { CollectionMovieService } from '../collection-movie/collection-movie.service';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @Inject(forwardRef(() => CollectionMovieService))
    private readonly collectionMovieService: CollectionMovieService,
  ) {}

  create = async (
    createCollectionInput: CreateCollectionInput,
  ): Promise<CollectionEntity> => {
    const collection = await this.collectionRepository.save(
      createCollectionInput,
    );
    const { moviesIds } = createCollectionInput;
    if (moviesIds) {
      await this.collectionMovieService.createManyForCollection(
        collection.id,
        moviesIds,
      );
    }
    return collection;
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<CollectionEntity>,
    filter?: FilterType<CollectionEntity>,
  ): Promise<PaginatedCollections> => {
    const qb = parseArgsToQuery(
      this.collectionRepository,
      pagination,
      sort,
      filter,
    );

    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();
    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyByIds = async (ids: number[]): Promise<CollectionEntity[]> =>
    this.collectionRepository.findBy({ id: In(ids) });

  readOne = async (id: number): Promise<CollectionEntity> => {
    const collection = await this.collectionRepository.findOneBy({ id });
    if (!collection) {
      throw new NotFoundError(`Collection with id "${id}" not found!`);
    }
    return collection;
  };

  update = async (
    id: number,
    updateCollectionInput: UpdateCollectionInput,
  ): Promise<CollectionEntity> => {
    const collection = await this.collectionRepository.findOneBy({ id });
    if (!collection) {
      throw new NotFoundError(`Collection with id "${id}" not found!`);
    }
    return this.collectionRepository.save({
      ...collection,
      ...updateCollectionInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const collection = await this.collectionRepository.findOneBy({ id });
    if (!collection) {
      throw new NotFoundError(`Collection with id "${id}" not found!`);
    }
    await this.collectionRepository.delete(id);
    return true;
  };
}
