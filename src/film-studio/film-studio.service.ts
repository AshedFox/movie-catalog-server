import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FilmService } from '../film/film.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { FilmStudioModel } from './entities/film-studio.model';
import { StudioService } from '../studio/studio.service';

@Injectable()
export class FilmStudioService {
  constructor(
    @InjectRepository(FilmStudioModel)
    private readonly filmStudioRepository: Repository<FilmStudioModel>,
    @Inject(forwardRef(() => FilmService))
    private readonly filmService: FilmService,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: StudioService,
  ) {}

  async create(filmId: string, studioId: number): Promise<FilmStudioModel> {
    await this.filmService.readOne(filmId);
    await this.studioService.readOne(studioId);
    const filmStudio = await this.filmStudioRepository.findOneBy({
      filmId,
      studioId,
    });
    if (filmStudio) {
      throw new AlreadyExistsError(
        `Studio with id "${studioId}" already exists for film with id "${filmId}"`,
      );
    }
    return this.filmStudioRepository.save({ filmId, studioId });
  }

  async createFilmStudios(
    filmId: string,
    studiosIds: number[],
  ): Promise<FilmStudioModel[]> {
    return this.filmStudioRepository.save(
      studiosIds.map((studioId) => ({ filmId, studioId })),
    );
  }

  async readAll(): Promise<FilmStudioModel[]> {
    return this.filmStudioRepository.find();
  }

  async readFilmsStudios(filmsIds: string[]): Promise<FilmStudioModel[]> {
    return this.filmStudioRepository.find({
      where: { filmId: In(filmsIds) },
      relations: {
        studio: true,
      },
    });
  }

  async readOne(filmId: string, studioId: number): Promise<FilmStudioModel> {
    const filmStudio = await this.filmStudioRepository.findOneBy({
      filmId,
      studioId,
    });
    if (!filmStudio) {
      throw new NotFoundError();
    }
    return filmStudio;
  }

  async delete(filmId: string, studioId: number): Promise<boolean> {
    const filmStudio = await this.filmStudioRepository.findOneBy({
      filmId,
      studioId,
    });
    if (!filmStudio) {
      throw new NotFoundError();
    }
    await this.filmStudioRepository.remove(filmStudio);
    return true;
  }
}
