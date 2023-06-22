import { Injectable } from '@nestjs/common';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '@common/services/base.service';
import { CollectionMovieEntity } from '../collection-movie/entities/collection-movie.entity';
import { CollectionEntity } from './entities/collection.entity';

@Injectable()
export class CollectionService extends BaseService<
  CollectionEntity,
  CreateCollectionInput,
  UpdateCollectionInput
> {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(collectionRepository);
  }

  create = async (
    createCollectionInput: CreateCollectionInput & { ownerId: string },
  ): Promise<CollectionEntity> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const collection = await queryRunner.manager.save(
        CollectionEntity,
        createCollectionInput,
      );
      const { moviesIds } = createCollectionInput;

      if (moviesIds) {
        collection.moviesConnection = await queryRunner.manager.save(
          CollectionMovieEntity,
          moviesIds.map((movieId) => ({
            collectionId: collection.id,
            movieId,
          })),
        );
      }
      await queryRunner.commitTransaction();
      return collection;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}
