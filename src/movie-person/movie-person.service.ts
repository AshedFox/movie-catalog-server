import { Injectable } from '@nestjs/common';
import { CreateMoviePersonInput } from './dto/create-movie-person.input';
import { UpdateMoviePersonInput } from './dto/update-movie-person.input';
import { MoviePersonTypeEnum } from '../utils/enums/movie-person-type.enum';
import { MoviePersonEntity } from './entities/movie-person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieService } from '../movie/movie.service';
import { PersonService } from '../person/person.service';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';

@Injectable()
export class MoviePersonService {
  constructor(
    @InjectRepository(MoviePersonEntity)
    private readonly moviePersonRepository: Repository<MoviePersonEntity>,
    private readonly movieService: MovieService,
    private readonly personService: PersonService,
  ) {}

  create = async (createMoviePersonInput: CreateMoviePersonInput) => {
    const { movieId, personId } = createMoviePersonInput;
    await this.movieService.readOne(movieId);
    await this.personService.readOne(personId);
    const moviePerson = await this.moviePersonRepository.findOneBy({
      movieId,
      personId,
    });
    if (moviePerson) {
      throw new AlreadyExistsError(
        `Movie person with movieId "${movieId}" and personId "${personId}" already exists!`,
      );
    }
    return this.moviePersonRepository.save(createMoviePersonInput);
  };

  readMany = async (
    take: number,
    skip: number,
    movieId?: string,
    personId?: number,
    type?: MoviePersonTypeEnum,
  ) => {
    const [data, count] = await this.moviePersonRepository.findAndCount({
      where: {
        movieId,
        personId,
        type,
      },
      take,
      skip,
    });

    return { data, count, hasNext: count > take + skip };
  };

  readManyByIds = async (ids: number[]): Promise<MoviePersonEntity[]> =>
    await this.moviePersonRepository.findBy({ id: In(ids) });

  readManyByMovies = async (
    moviesIds: string[],
  ): Promise<MoviePersonEntity[]> =>
    await this.moviePersonRepository.findBy({ movieId: In(moviesIds) });

  readOne = async (id: number): Promise<MoviePersonEntity> => {
    const moviePerson = await this.moviePersonRepository.findOneBy({ id });
    if (!moviePerson) {
      throw new NotFoundError(`Movie person with id "${id}" not found!`);
    }
    return moviePerson;
  };

  update = async (
    id: number,
    updateMoviePersonInput: UpdateMoviePersonInput,
  ): Promise<MoviePersonEntity> => {
    const moviePerson = await this.moviePersonRepository.findOneBy({ id });
    if (!moviePerson) {
      throw new NotFoundError(`Movie person with id "${id}" not found!`);
    }
    return this.moviePersonRepository.save({
      ...moviePerson,
      ...updateMoviePersonInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const moviePerson = await this.moviePersonRepository.findOneBy({ id });
    if (!moviePerson) {
      throw new NotFoundError(`Movie person with id "${id}" not found!`);
    }
    await this.moviePersonRepository.remove(moviePerson);
    return true;
  };
}
