import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { FilmEntity } from './entities/film.entity';
import { ILike, In, Repository } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import { MovieStudioService } from '../movie-studio/movie-studio.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    private readonly movieGenreService: MovieGenreService,
    private readonly movieStudioService: MovieStudioService,
  ) {}

  create = async (createFilmInput: CreateFilmInput): Promise<FilmEntity> => {
    const film = await this.filmRepository.create(createFilmInput);
    const { genresIds, studiosIds } = createFilmInput;
    if (genresIds) {
      await this.movieGenreService.createManyForMovie(film.id, genresIds);
    }
    if (studiosIds) {
      await this.movieStudioService.createManyForMovie(film.id, studiosIds);
    }
    return film;
  };

  readMany = async (
    take: number,
    skip: number,
    title?: string,
  ): Promise<PaginatedFilms> => {
    const [data, count] = await this.filmRepository.findAndCount({
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

  readManyByIds = async (ids: string[]): Promise<FilmEntity[]> =>
    await this.filmRepository.findBy({ id: In(ids) });

  readOne = async (id: string): Promise<FilmEntity> => {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundError(`Film with id "${id}" not found!`);
    }
    return film;
  };

  update = async (
    id: string,
    updateFilmInput: UpdateFilmInput,
  ): Promise<FilmEntity> => {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundError(`Film with id "${id}" not found!`);
    }
    return this.filmRepository.save({
      ...film,
      ...updateFilmInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundError(`Film with id "${id}" not found!`);
    }
    await this.filmRepository.remove(film);
    return true;
  };
}
