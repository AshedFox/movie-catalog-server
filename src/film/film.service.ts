import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { FilmEntity } from './entities/film.entity';
import { In, Repository } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '@utils/errors';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import { MovieStudioService } from '../movie-studio/movie-studio.service';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    private readonly movieGenreService: MovieGenreService,
    private readonly movieStudioService: MovieStudioService,
  ) {}

  create = async (createFilmInput: CreateFilmInput): Promise<FilmEntity> => {
    const film = await this.filmRepository.save(createFilmInput);
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
    pagination?: GqlOffsetPagination,
    sort?: SortType<FilmEntity>,
    filter?: FilterType<FilmEntity>,
  ): Promise<PaginatedFilms> => {
    const qb = parseArgsToQuery(this.filmRepository, pagination, sort, filter);

    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();
    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
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
