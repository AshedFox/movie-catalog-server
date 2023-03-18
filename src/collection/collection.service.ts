import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from './entities/collection.entity';
import { CollectionMovieService } from '../collection-movie/collection-movie.service';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class CollectionService extends BaseService<
  CollectionEntity,
  CreateCollectionInput,
  UpdateCollectionInput
> {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @Inject(forwardRef(() => CollectionMovieService))
    private readonly collectionMovieService: CollectionMovieService,
  ) {
    super(collectionRepository);
  }

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
}
