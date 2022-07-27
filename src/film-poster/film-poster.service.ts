import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FilmService } from '../film/film.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { FilmPosterModel } from './entities/film-poster.model';
import { ImageService } from '../image/image.service';

@Injectable()
export class FilmPosterService {
  constructor(
    @InjectRepository(FilmPosterModel)
    private readonly filmPosterRepository: Repository<FilmPosterModel>,
    @Inject(forwardRef(() => FilmService))
    private readonly filmService: FilmService,
    @Inject(forwardRef(() => ImageService))
    private readonly posterService: ImageService,
  ) {}

  async create(filmId: string, imageId: string) {
    await this.filmService.readOne(filmId);
    await this.posterService.readOne(imageId);
    const filmPoster = await this.filmPosterRepository.findOneBy({
      filmId,
      imageId,
    });
    if (filmPoster) {
      throw new AlreadyExistsError(
        `Poster with image id "${imageId}" already exists for film with id "${filmId}"`,
      );
    }
    return this.filmPosterRepository.save({ filmId, imageId });
  }

  async createFilmPosters(
    filmId: string,
    postersIds: string[],
  ): Promise<FilmPosterModel[]> {
    return this.filmPosterRepository.save(
      postersIds.map((imageId) => ({ filmId, imageId })),
    );
  }

  async readAll(): Promise<FilmPosterModel[]> {
    return this.filmPosterRepository.find();
  }

  async readFilmsPosters(filmsIds: string[]): Promise<FilmPosterModel[]> {
    return this.filmPosterRepository.find({
      where: { filmId: In(filmsIds) },
      relations: {
        image: true,
      },
    });
  }

  async readOne(filmId: string, imageId: string): Promise<FilmPosterModel> {
    const filmPoster = await this.filmPosterRepository.findOneBy({
      filmId,
      imageId,
    });
    if (!filmPoster) {
      throw new NotFoundError();
    }
    return filmPoster;
  }

  async delete(filmId: string, imageId: string) {
    const filmPoster = await this.filmPosterRepository.findOneBy({
      filmId,
      imageId,
    });
    if (!filmPoster) {
      throw new NotFoundError();
    }
    await this.filmPosterRepository.remove(filmPoster);
    return true;
  }
}
