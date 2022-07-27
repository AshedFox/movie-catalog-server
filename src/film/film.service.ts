import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { FilmModel } from './entities/film.model';
import { ILike, In, Repository } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { FilmGenreService } from '../film-genre/film-genre.service';
import { FilmStudioService } from '../film-studio/film-studio.service';
import { FilmPosterService } from '../film-poster/film-poster.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmModel)
    private readonly filmRepository: Repository<FilmModel>,
    private readonly filmGenreService: FilmGenreService,
    private readonly filmStudioService: FilmStudioService,
    private readonly filmPosterService: FilmPosterService,
  ) {}

  async create(createFilmInput: CreateFilmInput): Promise<FilmModel> {
    const film = await this.filmRepository.save(createFilmInput);
    const { genresIds, studiosIds, postersIds } = createFilmInput;
    if (genresIds) {
      await this.filmGenreService.createFilmGenres(film.id, genresIds);
    }
    if (studiosIds) {
      await this.filmStudioService.createFilmStudios(film.id, studiosIds);
    }
    if (postersIds) {
      await this.filmPosterService.createFilmPosters(film.id, postersIds);
    }
    return film;
  }

  async readAll(
    take: number,
    skip: number,
    title?: string,
  ): Promise<PaginatedFilms> {
    const [data, count] = await this.filmRepository.findAndCount({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
      },
      take,
      skip,
      order: {
        publicationDate: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  }

  async readAllByIds(ids: string[]): Promise<FilmModel[]> {
    return await this.filmRepository.findBy({ id: In(ids) });
  }

  async readOne(id: string): Promise<FilmModel> {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundError();
    }
    return film;
  }

  async update(
    id: string,
    updateFilmInput: UpdateFilmInput,
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundError();
    }
    return this.filmRepository.save({
      ...film,
      ...updateFilmInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundError();
    }
    await this.filmRepository.remove(film);
    return true;
  }
}
