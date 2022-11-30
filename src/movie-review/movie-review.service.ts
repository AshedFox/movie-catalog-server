import { Injectable } from '@nestjs/common';
import { CreateMovieReviewInput } from './dto/create-movie-review.input';
import { UpdateMovieReviewInput } from './dto/update-movie-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieReviewEntity } from './entities/movie-review.entity';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { PaginatedMoviesReviews } from './dto/paginated-movies-reviews';

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
    pagination?: GqlOffsetPagination,
    sort?: SortType<MovieReviewEntity>,
    filter?: FilterType<MovieReviewEntity>,
  ): Promise<PaginatedMoviesReviews> => {
    const qb = parseArgsToQuery(
      this.reviewRepository,
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
