import { Injectable } from '@nestjs/common';
import { CreateMovieReviewInput } from './dto/create-movie-review.input';
import { UpdateMovieReviewInput } from './dto/update-movie-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieReviewEntity } from './entities/movie-review.entity';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { NotFoundError } from '../utils/errors/not-found.error';

@Injectable()
export class MovieReviewService {
  constructor(
    @InjectRepository(MovieReviewEntity)
    private readonly reviewRepository: Repository<MovieReviewEntity>,
  ) {}

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

  readMany = async (
    take: number,
    skip: number,
    userId?: string,
    movieId?: string,
  ) => {
    const [data, count] = await this.reviewRepository.findAndCount({
      where: {
        userId,
        movieId,
      },
      take,
      skip,
      order: {
        createdAt: 'ASC',
      },
    });
    return { data, count, hasNext: count > take + skip };
  };

  readManyByIds = async (ids: number[]) =>
    this.reviewRepository.findBy({ id: In(ids) });

  readManyByMovies = async (moviesIds: string[]) =>
    this.reviewRepository.findBy({ movieId: In(moviesIds) });

  readManyByUsers = async (usersIds: string[]) =>
    this.reviewRepository.findBy({ userId: In(usersIds) });

  readOne = async (id: number) => {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundError(`Review with id "${id}" not found!`);
    }
    return review;
  };

  update = async (id: number, updateReviewInput: UpdateMovieReviewInput) => {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundError(`Review with id "${id}" not found!`);
    }
    return this.reviewRepository.save({ ...review, ...updateReviewInput });
  };

  delete = async (id: number) => {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new NotFoundError(`Review with id "${id}" not found!`);
    }
    await this.reviewRepository.remove(review);
    return true;
  };
}
