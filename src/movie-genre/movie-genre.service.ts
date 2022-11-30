import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { MovieGenreEntity } from './entities/movie-genre.entity';
import { MovieService } from '../movie/movie.service';
import { GenreService } from '../genre/genre.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';

@Injectable()
export class MovieGenreService {
  constructor(
    @InjectRepository(MovieGenreEntity)
    private readonly movieGenreRepository: Repository<MovieGenreEntity>,
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
    @Inject(forwardRef(() => GenreService))
    private readonly genreService: GenreService,
  ) {}

  create = async (movieId: string, genreId: string) => {
    await this.movieService.readOne(movieId);
    await this.genreService.readOne(genreId);
    const movieGenre = await this.movieGenreRepository.findOneBy({
      movieId,
      genreId,
    });
    if (movieGenre) {
      throw new AlreadyExistsError(
        `Movie genre with movieId "${movieId}" and genreId "${genreId}" already exists!`,
      );
    }
    return this.movieGenreRepository.save({ movieId, genreId });
  };

  createManyForMovie = async (
    movieId: string,
    genresIds: string[],
  ): Promise<MovieGenreEntity[]> =>
    this.movieGenreRepository.save(
      genresIds.map((genreId) => ({ movieId, genreId })),
      { chunk: 100 },
    );

  readMany = async (): Promise<MovieGenreEntity[]> =>
    this.movieGenreRepository.find();

  readManyByMovies = async (moviesIds: string[]): Promise<MovieGenreEntity[]> =>
    this.movieGenreRepository.find({
      where: { movieId: In(moviesIds) },
      relations: {
        genre: true,
      },
    });

  readOne = async (
    movieId: string,
    genreId: string,
  ): Promise<MovieGenreEntity> => {
    const movieGenre = await this.movieGenreRepository.findOneBy({
      movieId,
      genreId,
    });
    if (!movieGenre) {
      throw new NotFoundError(
        `Movie genre with movieId "${movieId}" and genreId "${genreId}" not found!`,
      );
    }
    return movieGenre;
  };

  delete = async (movieId: string, genreId: string) => {
    const movieGenre = await this.movieGenreRepository.findOneBy({
      movieId,
      genreId,
    });
    if (!movieGenre) {
      throw new NotFoundError(
        `Movie genre with movieId "${movieId}" and genreId "${genreId}" not found!`,
      );
    }
    await this.movieGenreRepository.remove(movieGenre);
    return true;
  };
}
