import { Injectable } from '@nestjs/common';
import { CreateMoviePersonInput } from './dto/create-movie-person.input';
import { UpdateMoviePersonInput } from './dto/update-movie-person.input';
import { MoviePersonEntity } from './entities/movie-person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { MovieService } from '../movie/movie.service';
import { PersonService } from '../person/person.service';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { PaginatedMoviesPersons } from './dto/paginated-movies-persons';

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
    pagination?: GqlOffsetPagination,
    sort?: SortType<MoviePersonEntity>,
    filter?: FilterType<MoviePersonEntity>,
  ): Promise<PaginatedMoviesPersons> => {
    const qb = parseArgsToQuery(
      this.moviePersonRepository,
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
