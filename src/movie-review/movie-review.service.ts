import { Injectable } from '@nestjs/common';
import { CreateMovieReviewInput } from './dto/create-movie-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieReviewEntity } from './entities/movie-review.entity';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { BaseService } from '@common/services';
import { UpdateMovieReviewInput } from './dto/update-movie-review.input';

@Injectable()
export class MovieReviewService extends BaseService<
  MovieReviewEntity,
  CreateMovieReviewInput,
  UpdateMovieReviewInput
> {
  constructor(
    @InjectRepository(MovieReviewEntity)
    private readonly reviewRepository: Repository<MovieReviewEntity>,
  ) {
    super(reviewRepository);
  }

  create = async (createReviewInput: CreateMovieReviewInput) => {
    const { userId, movieId } = createReviewInput;
    const review = await this.reviewRepository.findOneBy({ userId, movieId });
    if (review) {
      throw new AlreadyExistsError(
        `Review with userId "${userId}" and movieId "${movieId}" already exists!`,
      );
    }
    return this.reviewRepository.save(createReviewInput);
  };

  readManyByMovies = async (moviesIds: string[]) =>
    this.reviewRepository.findBy({ movieId: In(moviesIds) });

  readManyByUsers = async (usersIds: string[]) =>
    this.reviewRepository.findBy({ userId: In(usersIds) });
}
