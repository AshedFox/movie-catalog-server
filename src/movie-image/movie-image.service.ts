import { Injectable } from '@nestjs/common';
import { CreateMovieImageInput } from './dto/create-movie-image.input';
import { UpdateMovieImageInput } from './dto/update-movie-image.input';
import { MovieImageTypeEnum } from '../utils/enums/movie-image-type.enum';
import { MovieImageEntity } from './entities/movie-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieService } from '../movie/movie.service';
import { ImageService } from '../image/image.service';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';

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
    take: number,
    skip: number,
    movieId?: string,
    imageId?: string,
    type?: MovieImageTypeEnum,
  ) => {
    const [data, count] = await this.movieImageRepository.findAndCount({
      where: {
        movieId,
        imageId,
        type,
      },
      take,
      skip,
    });

    return { data, count, hasNext: count > take + skip };
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
