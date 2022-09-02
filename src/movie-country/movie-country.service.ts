import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieCountryEntity } from './entities/movie-country.entity';
import { CountryService } from '../country/country.service';

@Injectable()
export class MovieCountryService {
  constructor(
    @InjectRepository(MovieCountryEntity)
    private readonly movieCountryRepository: Repository<MovieCountryEntity>,
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
    @Inject(forwardRef(() => CountryService))
    private readonly countryService: CountryService,
  ) {}

  create = async (movieId: string, countryId: number) => {
    await this.movieService.readOne(movieId);
    await this.countryService.readOne(countryId);
    const movieCountry = await this.movieCountryRepository.findOneBy({
      movieId,
      countryId,
    });
    if (movieCountry) {
      throw new AlreadyExistsError(
        `Movie country with movieId "${movieId}" and countryId "${countryId}" already exists!`,
      );
    }
    return this.movieCountryRepository.save({ movieId, countryId });
  };

  createManyForMovie = async (
    movieId: string,
    countriesIds: number[],
  ): Promise<MovieCountryEntity[]> =>
    this.movieCountryRepository.save(
      countriesIds.map((countryId) => ({ movieId, countryId })),
      { chunk: 100 },
    );

  readMany = async (): Promise<MovieCountryEntity[]> =>
    this.movieCountryRepository.find();

  readManyByMovies = async (
    moviesIds: string[],
  ): Promise<MovieCountryEntity[]> =>
    this.movieCountryRepository.find({
      where: { movieId: In(moviesIds) },
      relations: {
        country: true,
      },
    });

  readOne = async (
    movieId: string,
    countryId: number,
  ): Promise<MovieCountryEntity> => {
    const movieCountry = await this.movieCountryRepository.findOneBy({
      movieId,
      countryId,
    });
    if (!movieCountry) {
      throw new NotFoundError(
        `Movie country with movieId "${movieId}" and countryId "${countryId}" not found!`,
      );
    }
    return movieCountry;
  };

  delete = async (movieId: string, countryId: number) => {
    const movieCountry = await this.movieCountryRepository.findOneBy({
      movieId,
      countryId,
    });
    if (!movieCountry) {
      throw new NotFoundError(
        `Movie country with movieId "${movieId}" and countryId "${countryId}" not found!`,
      );
    }
    await this.movieCountryRepository.remove(movieCountry);
    return true;
  };
}
