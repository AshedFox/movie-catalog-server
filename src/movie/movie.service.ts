import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMovieInput } from './dto/create-movie.input';
import { MovieEntity } from './entities/movie.entity';
import { ILike, In, Repository } from 'typeorm';
import { UpdateMovieInput } from './dto/update-movie.input';
import { PaginatedMovies } from './dto/paginated-movies';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import { MovieStudioService } from '../movie-studio/movie-studio.service';
import { MovieCountryService } from '../movie-country/movie-country.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @Inject(forwardRef(() => MovieCountryService))
    private readonly movieCountryService: MovieCountryService,
    @Inject(forwardRef(() => MovieGenreService))
    private readonly movieGenreService: MovieGenreService,
    @Inject(forwardRef(() => MovieStudioService))
    private readonly movieStudioService: MovieStudioService,
  ) {}

  create = async (createMovieInput: CreateMovieInput): Promise<MovieEntity> => {
    const movie = await this.movieRepository.save(createMovieInput);
    const { genresIds, studiosIds, countriesIds } = createMovieInput;
    if (countriesIds) {
      await this.movieCountryService.createManyForMovie(movie.id, countriesIds);
    }
    if (genresIds) {
      await this.movieGenreService.createManyForMovie(movie.id, genresIds);
    }
    if (studiosIds) {
      await this.movieStudioService.createManyForMovie(movie.id, studiosIds);
    }
    return movie;
  };

  readMany = async (
    take: number,
    skip: number,
    title?: string,
  ): Promise<PaginatedMovies> => {
    const [data, count] = await this.movieRepository.findAndCount({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
      },
      take,
      skip,
      order: {
        createdAt: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  };

  readManyByIds = async (ids: string[]): Promise<MovieEntity[]> => {
    return this.movieRepository.findBy({ id: In(ids) });
  };

  readOne = async (id: string): Promise<MovieEntity> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id "${id}" not found!`);
    }
    return movie;
  };

  update = async (
    id: string,
    updateMovieInput: UpdateMovieInput,
  ): Promise<MovieEntity> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id "${id}" not found!`);
    }
    return this.movieRepository.save({
      ...movie,
      ...updateMovieInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundError(`Movie with id ${id} not found!`);
    }
    await this.movieRepository.remove(movie);
    return true;
  };
}
