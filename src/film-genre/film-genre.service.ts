import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { FilmGenreModel } from './entities/film-genre.model';
import { FilmService } from '../film/film.service';
import { GenreService } from '../genre/genre.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class FilmGenreService {
  constructor(
    @InjectRepository(FilmGenreModel)
    private readonly filmGenreRepository: Repository<FilmGenreModel>,
    @Inject(forwardRef(() => FilmService))
    private readonly filmService: FilmService,
    @Inject(forwardRef(() => GenreService))
    private readonly genreService: GenreService,
  ) {}

  async create(filmId: string, genreId: string) {
    await this.filmService.readOne(filmId);
    await this.genreService.readOne(genreId);
    const filmGenre = await this.filmGenreRepository.findOneBy({
      filmId,
      genreId,
    });
    if (filmGenre) {
      throw new AlreadyExistsError(
        `Genre with id "${genreId}" already exists for film with id "${filmId}"`,
      );
    }
    return this.filmGenreRepository.save({ filmId, genreId });
  }

  async createFilmGenres(
    filmId: string,
    genresIds: string[],
  ): Promise<FilmGenreModel[]> {
    return this.filmGenreRepository.save(
      genresIds.map((genreId) => ({ filmId, genreId })),
    );
  }

  async readAll(): Promise<FilmGenreModel[]> {
    return this.filmGenreRepository.find();
  }

  async readFilmsGenres(filmsIds: string[]): Promise<FilmGenreModel[]> {
    return this.filmGenreRepository.find({
      where: { filmId: In(filmsIds) },
      relations: {
        genre: true,
      },
    });
  }

  async readOne(filmId: string, genreId: string): Promise<FilmGenreModel> {
    const filmGenre = await this.filmGenreRepository.findOneBy({
      filmId,
      genreId,
    });
    if (!filmGenre) {
      throw new NotFoundError();
    }
    return filmGenre;
  }

  async delete(filmId: string, genreId: string) {
    const filmGenre = await this.filmGenreRepository.findOneBy({
      filmId,
      genreId,
    });
    if (!filmGenre) {
      throw new NotFoundError();
    }
    await this.filmGenreRepository.remove(filmGenre);
    return true;
  }
}
