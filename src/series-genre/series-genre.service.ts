import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GenreService } from '../genre/genre.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeriesGenreModel } from './entities/series-genre.model';
import { SeriesService } from '../series/series.service';

@Injectable()
export class SeriesGenreService {
  constructor(
    @InjectRepository(SeriesGenreModel)
    private readonly seriesGenreRepository: Repository<SeriesGenreModel>,
    @Inject(forwardRef(() => SeriesService))
    private readonly seriesService: SeriesService,
    @Inject(forwardRef(() => GenreService))
    private readonly genreService: GenreService,
  ) {}

  async create(seriesId: string, genreId: string) {
    await this.seriesService.readOne(seriesId);
    await this.genreService.readOne(genreId);
    const seriesGenre = await this.seriesGenreRepository.findOneBy({
      seriesId,
      genreId,
    });
    if (seriesGenre) {
      throw new AlreadyExistsError(
        `Genre with id "${genreId}" already exists for series with id "${seriesId}"`,
      );
    }
    return this.seriesGenreRepository.save({ seriesId, genreId });
  }

  async createSeriesGenres(seriesId: string, genresIds: string[]) {
    return this.seriesGenreRepository.save(
      genresIds.map((genreId) => ({ seriesId, genreId })),
    );
  }

  async readAll(): Promise<SeriesGenreModel[]> {
    return this.seriesGenreRepository.find();
  }

  async readManySeriesGenres(seriesIds: string[]): Promise<SeriesGenreModel[]> {
    return this.seriesGenreRepository.find({
      where: { seriesId: In(seriesIds) },
      relations: {
        genre: true,
      },
    });
  }

  async readOne(seriesId: string, genreId: string): Promise<SeriesGenreModel> {
    const seriesGenre = await this.seriesGenreRepository.findOneBy({
      seriesId,
      genreId,
    });
    if (!seriesGenre) {
      throw new NotFoundError();
    }
    return seriesGenre;
  }

  async delete(seriesId: string, genreId: string) {
    const seriesGenre = await this.seriesGenreRepository.findOneBy({
      seriesId,
      genreId,
    });
    if (!seriesGenre) {
      throw new NotFoundError();
    }
    await this.seriesGenreRepository.remove(seriesGenre);
    return true;
  }
}
