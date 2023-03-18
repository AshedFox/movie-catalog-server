import { Injectable } from '@nestjs/common';
import { CreateMoviePersonInput } from './dto/create-movie-person.input';
import { UpdateMoviePersonInput } from './dto/update-movie-person.input';
import { MoviePersonEntity } from './entities/movie-person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '@utils/errors';
import { MovieService } from '../movie/movie.service';
import { PersonService } from '../person/person.service';
import { BaseService } from '@common/services';

@Injectable()
export class MoviePersonService extends BaseService<
  MoviePersonEntity,
  CreateMoviePersonInput,
  UpdateMoviePersonInput
> {
  constructor(
    @InjectRepository(MoviePersonEntity)
    private readonly moviePersonRepository: Repository<MoviePersonEntity>,
    private readonly movieService: MovieService,
    private readonly personService: PersonService,
  ) {
    super(moviePersonRepository);
  }

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

  readManyByMovies = async (
    moviesIds: string[],
  ): Promise<MoviePersonEntity[]> =>
    await this.moviePersonRepository.findBy({ movieId: In(moviesIds) });
}
