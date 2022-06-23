import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { FilmModel } from './entities/film.model';
import { ILike, Repository } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { GenreService } from '../genre/genre.service';
import { StudioService } from '../studio/studio.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmModel)
    private readonly filmRepository: Repository<FilmModel>,
    private readonly genreService: GenreService,
    private readonly studioService: StudioService,
  ) {}

  async create(createFilmInput: CreateFilmInput): Promise<FilmModel> {
    const film = await this.filmRepository.create(createFilmInput);
    const { genresIds, studiosIds } = createFilmInput;

    if (genresIds && genresIds.length > 0) {
      film.genres = Promise.resolve(
        await this.genreService.readAllByIds(genresIds),
      );
    }
    if (studiosIds && studiosIds.length > 0) {
      film.studios = Promise.resolve(
        await this.studioService.readAllByIds(studiosIds),
      );
    }

    return this.filmRepository.save(film);
  }

  async readAll(
    title: string,
    take: number,
    skip: number,
  ): Promise<PaginatedFilms> {
    const [data, count] = await this.filmRepository.findAndCount({
      where: [
        title
          ? {
              title: ILike(`%${title}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        publicationDate: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readAllByIds(ids: string[]): Promise<FilmModel[]> {
    return await this.filmRepository.findByIds(ids);
  }

  async readOne(id: string): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(id);
    if (!film) {
      throw new NotFoundError();
    }
    return film;
  }

  async update(
    id: string,
    updateFilmInput: UpdateFilmInput,
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(id);
    if (!film) {
      throw new NotFoundError();
    }
    return this.filmRepository.save({
      ...film,
      ...updateFilmInput,
    });
  }

  async addGenresToFilm(
    filmId: string,
    genresIds: string[],
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(filmId, {
      relations: ['genres'],
    });
    const genres = await this.genreService.readAllByIds(genresIds);
    const currentGenres = await film.genres;
    for (const genre of genres) {
      if (!currentGenres.find((g) => g.id === genre.id)) {
        currentGenres.push(genre);
      }
    }
    film.genres = Promise.resolve(currentGenres);
    return this.filmRepository.save(film);
  }

  async deleteGenresFromFilm(
    filmId: string,
    genresIds: string[],
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(filmId);
    const currentGenres = await film.genres;
    film.genres = Promise.resolve(
      currentGenres.filter((genre) => !genresIds.includes(genre.id)),
    );
    return this.filmRepository.save(film);
  }

  async addStudiosToFilm(
    filmId: string,
    studiosIds: number[],
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(filmId, {
      relations: ['studios'],
    });
    const studios = await this.studioService.readAllByIds(studiosIds);
    const currentStudios = await film.studios;
    for (const studio of studios) {
      if (!currentStudios.find((g) => g.id === studio.id)) {
        currentStudios.push(studio);
      }
    }
    film.studios = Promise.resolve(currentStudios);
    return this.filmRepository.save(film);
  }

  async deleteStudiosFromFilm(
    filmId: string,
    studiosIds: number[],
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(filmId);
    const currentStudios = await film.studios;
    film.studios = Promise.resolve(
      currentStudios.filter((studio) => !studiosIds.includes(studio.id)),
    );
    return this.filmRepository.save(film);
  }

  async delete(id: string): Promise<boolean> {
    const film = await this.filmRepository.findOne(id);
    if (!film) {
      throw new NotFoundError();
    }
    await this.filmRepository.remove(film);
    return true;
  }
}
