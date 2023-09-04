import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { MovieStudioEntity } from './entities/movie-studio.entity';
import { MovieService } from '../movie/movie.service';
import { StudioService } from '../studio/studio.service';
import { WrapperType } from '@utils/types';

@Injectable()
export class MovieStudioService {
  constructor(
    @InjectRepository(MovieStudioEntity)
    private readonly movieStudioRepository: Repository<MovieStudioEntity>,
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: WrapperType<MovieService>,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: WrapperType<StudioService>,
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

  readMany = async (): Promise<MovieStudioEntity[]> =>
    this.movieStudioRepository.find();

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

  delete = async (
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
    return this.movieStudioRepository.remove(movieStudio);
  };
}
