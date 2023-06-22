import { Injectable } from '@nestjs/common';
import { CreateCollectionReviewInput } from './dto/create-collection-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionReviewEntity } from './entities/collection-review.entity';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { BaseService } from '@common/services';
import { UpdateCollectionReviewInput } from './dto/update-collection-review.input';

@Injectable()
export class CollectionReviewService extends BaseService<
  CollectionReviewEntity,
  CreateCollectionReviewInput,
  UpdateCollectionReviewInput
> {
  constructor(
    @InjectRepository(CollectionReviewEntity)
    private readonly reviewRepository: Repository<CollectionReviewEntity>,
  ) {
    super(reviewRepository);
  }

  create = async (createReviewInput: CreateCollectionReviewInput) => {
    const { userId, collectionId } = createReviewInput;
    const review = await this.reviewRepository.findOneBy({
      userId,
      collectionId,
    });
    if (review) {
      throw new AlreadyExistsError(
        `Review with userId "${userId}" and collectionId "${collectionId}" already exists!`,
      );
    }
    return this.reviewRepository.save(createReviewInput);
  };

  readManyByUsers = async (usersIds: string[]) =>
    this.reviewRepository.findBy({ userId: In(usersIds) });
}
