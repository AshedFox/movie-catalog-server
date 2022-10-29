import { Injectable } from '@nestjs/common';
import { CreateMovieImageInput } from './dto/create-movie-image.input';
import { UpdateMovieImageInput } from './dto/update-movie-image.input';
import { MovieImageEntity } from './entities/movie-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieService } from '../movie/movie.service';
import { ImageService } from '../image/image.service';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { GqlOffsetPagination } from '../common/pagination';
import { SortType } from '../common/sort';
import { FilterType } from '../common/filter';
import { parseArgs } from '../common/typeorm-query-parser';
import { PaginatedMoviesImages } from './dto/paginated-movies-images';

@Injectable()
export class MovieImageService {
  constructor(
    @InjectRepository(MovieImageEntity)
    private readonly movieImageRepository: Repository<MovieImageEntity>,
    private readonly movieService: MovieService,
    private readonly imageService: ImageService,
  ) {}

  create = async (createMovieImageInput: CreateMovieImageInput) => {
    const { movieId, imageId } = createMovieImageInput;
    await this.movieService.readOne(movieId);
    await this.imageService.readOne(imageId);
    const movieImage = await this.movieImageRepository.findOneBy({
      movieId,
      imageId,
    });
    if (movieImage) {
      throw new AlreadyExistsError(
        `Movie image with movieId "${movieId}" and imageId "${imageId}" already exists!`,
      );
    }
    return this.movieImageRepository.save(createMovieImageInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<MovieImageEntity>,
    filter?: FilterType<MovieImageEntity>,
  ): Promise<PaginatedMoviesImages> => {
    const qb = parseArgs(
      this.movieImageRepository.createQueryBuilder(),
      pagination,
      sort,
      filter,
    );
    const [data, count] = await qb.getManyAndCount();

    return { data, count, hasNext: count > pagination.take + pagination.skip };
  };

  readManyByIds = async (ids: string[]): Promise<MovieImageEntity[]> =>
    await this.movieImageRepository.findBy({ id: In(ids) });

  readManyByMovies = async (moviesIds: string[]): Promise<MovieImageEntity[]> =>
    await this.movieImageRepository.findBy({ movieId: In(moviesIds) });

  readOne = async (id: number): Promise<MovieImageEntity> => {
    const movieImage = await this.movieImageRepository.findOneBy({ id });
    if (!movieImage) {
      throw new NotFoundError(`Movie image with id "${id}" not found!`);
    }
    return movieImage;
  };

  update = async (
    id: number,
    updateMovieImageInput: UpdateMovieImageInput,
  ): Promise<MovieImageEntity> => {
    const movieImage = await this.movieImageRepository.findOneBy({ id });
    if (!movieImage) {
      throw new NotFoundError(`Movie image with id "${id}" not found!`);
    }
    return this.movieImageRepository.save({
      ...movieImage,
      ...updateMovieImageInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const movieImage = await this.movieImageRepository.findOneBy({ id });
    if (!movieImage) {
      throw new NotFoundError(`Movie image with id "${id}" not found!`);
    }
    await this.movieImageRepository.remove(movieImage);
    return true;
  };
}
