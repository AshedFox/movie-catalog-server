import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieStudioEntity } from './entities/movie-studio.entity';
import { MovieService } from '../movie/movie.service';
import { StudioService } from '../studio/studio.service';

@Injectable()
export class MovieStudioService {
  constructor(
    @InjectRepository(MovieStudioEntity)
    private readonly movieStudioRepository: Repository<MovieStudioEntity>,
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: StudioService,
  ) {}

  create = async (
    movieId: string,
    studioId: number,
  ): Promise<MovieStudioEntity> => {
    await this.movieService.readOne(movieId);
    await this.studioService.readOne(studioId);
    const movieStudio = await this.movieStudioRepository.findOneBy({
      movieId,
      studioId,
    });
    if (movieStudio) {
      throw new AlreadyExistsError(
        `Movie studio with movieId "${movieId}" and studioId "${studioId}" already exists!`,
      );
    }
    return this.movieStudioRepository.save({ movieId, studioId });
  };

  createManyForMovie = async (
    movieId: string,
    studiosIds: number[],
  ): Promise<MovieStudioEntity[]> =>
    this.movieStudioRepository.save(
      studiosIds.map((studioId) => ({ movieId, studioId })),
    );

  readMany = async (): Promise<MovieStudioEntity[]> =>
    this.movieStudioRepository.find();

  readManyByMovies = async (
    moviesIds: string[],
  ): Promise<MovieStudioEntity[]> =>
    this.movieStudioRepository.find({
      where: { movieId: In(moviesIds) },
      relations: {
        studio: true,
      },
    });

  readOne = async (
    movieId: string,
    studioId: number,
  ): Promise<MovieStudioEntity> => {
    const movieStudio = await this.movieStudioRepository.findOneBy({
      movieId,
      studioId,
    });
    if (!movieStudio) {
      throw new NotFoundError(
        `Movie studio with movieId "${movieId}" and studioId "${studioId}" not found!`,
      );
    }
    return movieStudio;
  };

  delete = async (movieId: string, studioId: number): Promise<boolean> => {
    const movieStudio = await this.movieStudioRepository.findOneBy({
      movieId,
      studioId,
    });
    if (!movieStudio) {
      throw new NotFoundError(
        `Movie studio with movieId "${movieId}" and studioId "${studioId}" not found!`,
      );
    }
    await this.movieStudioRepository.remove(movieStudio);
    return true;
  };
}
