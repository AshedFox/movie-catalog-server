import { Injectable } from '@nestjs/common';
import { CreateMovieUserInput } from './dto/create-movie-user.input';
import { UpdateMovieUserInput } from './dto/update-movie-user.input';
import { MovieUserEntity } from './entities/movie-user.entity';
import { Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieService } from '../movie/movie.service';
import { UserService } from '../user/user.service';
import { PaginatedMoviesUsers } from './dto/paginated-movies-users';
import { GqlOffsetPagination } from '@common/pagination';
import { FilterType } from '@common/filter';
import { SortType } from '@common/sort';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class MovieUserService {
  constructor(
    @InjectRepository(MovieUserEntity)
    private readonly movieUserRepository: Repository<MovieUserEntity>,
    private readonly movieService: MovieService,
    private readonly userService: UserService,
  ) {}

  create = async (createMovieUserInput: CreateMovieUserInput) => {
    const { userId, movieId } = createMovieUserInput;
    await this.movieService.readOne(movieId);
    await this.userService.readOneById(userId);
    const movieStudio = await this.movieUserRepository.findOneBy({
      movieId,
      userId,
    });
    if (movieStudio) {
      throw new AlreadyExistsError(
        `Movie user with movieId "${movieId}" and userId "${userId}" already exists!`,
      );
    }
    return this.movieUserRepository.save(createMovieUserInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<MovieUserEntity>,
    filter?: FilterType<MovieUserEntity>,
  ): Promise<PaginatedMoviesUsers | MovieUserEntity[]> => {
    const qb = parseArgsToQuery(
      this.movieUserRepository,
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

  readOne = async (
    movieId: string,
    userId: string,
  ): Promise<MovieUserEntity> => {
    const movieUser = await this.movieUserRepository.findOneBy({
      movieId,
      userId,
    });
    if (!movieUser) {
      throw new NotFoundError(
        `Movie user with movieId "${movieId}" and userId "${userId}" not found!`,
      );
    }
    return movieUser;
  };

  update = async (
    movieId: string,
    userId: string,
    updateMovieUserInput: UpdateMovieUserInput,
  ): Promise<MovieUserEntity> => {
    const movieUser = await this.movieUserRepository.findOneBy({
      movieId,
      userId,
    });
    if (!movieUser) {
      throw new NotFoundError(
        `Movie user with movieId "${movieId}" and userId "${userId}" not found!`,
      );
    }
    return this.movieUserRepository.save({
      ...movieUser,
      ...updateMovieUserInput,
    });
  };

  delete = async (
    movieId: string,
    userId: string,
  ): Promise<MovieUserEntity> => {
    const movieUser = await this.movieUserRepository.findOneBy({
      movieId,
      userId,
    });
    if (!movieUser) {
      throw new NotFoundError(
        `Movie user with movieId "${movieId}" and userId "${userId}" not found!`,
      );
    }
    return this.movieUserRepository.remove(movieUser);
  };
}
