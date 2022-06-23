import { Injectable } from '@nestjs/common';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { ILike, Repository } from 'typeorm';
import { PaginatedSeries } from './dto/paginated-series.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { GenreService } from '../genre/genre.service';
import { StudioService } from '../studio/studio.service';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SeriesModel)
    private readonly seriesRepository: Repository<SeriesModel>,
    private readonly genreService: GenreService,
    private readonly studioService: StudioService,
  ) {}

  async create(createSeriesInput: CreateSeriesInput): Promise<SeriesModel> {
    const series = this.seriesRepository.create(createSeriesInput);
    const { genresIds, studiosIds } = createSeriesInput;

    if (genresIds && genresIds.length > 1) {
      series.genres = Promise.resolve(
        await this.genreService.readAllByIds(genresIds),
      );
    }
    if (studiosIds && studiosIds.length > 1) {
      series.studios = Promise.resolve(
        await this.studioService.readAllByIds(studiosIds),
      );
    }

    return this.seriesRepository.save(series);
  }

  async readAll(
    title: string,
    take: number,
    skip: number,
  ): Promise<PaginatedSeries> {
    const [data, count] = await this.seriesRepository.findAndCount({
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

  async readAllByIds(ids: string[]): Promise<SeriesModel[]> {
    return await this.seriesRepository.findByIds(ids);
  }

  async readOne(id: string): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOne(id);
    if (!series) {
      throw new NotFoundError();
    }
    return series;
  }

  async update(
    id: string,
    updateSeriesInput: UpdateSeriesInput,
  ): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOne(id);
    if (!series) {
      throw new NotFoundError();
    }
    return this.seriesRepository.save({
      ...series,
      ...updateSeriesInput,
    });
  }

  async addGenresToSeries(
    seriesId: string,
    genresIds: string[],
  ): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOne(seriesId, {
      relations: ['genres'],
    });
    const genres = await this.genreService.readAllByIds(genresIds);
    const currentGenres = await series.genres;
    for (const genre of genres) {
      if (!currentGenres.find((g) => g.id === genre.id)) {
        currentGenres.push(genre);
      }
    }
    series.genres = Promise.resolve(currentGenres);
    return this.seriesRepository.save(series);
  }

  async deleteGenresFromSeries(
    seriesId: string,
    genresIds: string[],
  ): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOne(seriesId);
    const currentGenres = await series.genres;
    series.genres = Promise.resolve(
      currentGenres.filter((genre) => !genresIds.includes(genre.id)),
    );
    return this.seriesRepository.save(series);
  }

  async addStudiosToSeries(
    seriesId: string,
    studiosIds: number[],
  ): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOne(seriesId, {
      relations: ['studios'],
    });
    const studios = await this.studioService.readAllByIds(studiosIds);
    const currentStudios = await series.studios;
    for (const studio of studios) {
      if (!currentStudios.find((g) => g.id === studio.id)) {
        currentStudios.push(studio);
      }
    }
    series.studios = Promise.resolve(currentStudios);
    return this.seriesRepository.save(series);
  }

  async deleteStudiosFromSeries(
    seriesId: string,
    studiosIds: number[],
  ): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOne(seriesId);
    const currentStudios = await series.studios;
    series.studios = Promise.resolve(
      currentStudios.filter((studio) => !studiosIds.includes(studio.id)),
    );
    return this.seriesRepository.save(series);
  }

  async delete(id: string): Promise<boolean> {
    const series = await this.seriesRepository.findOne(id);
    if (!series) {
      throw new NotFoundError();
    }
    await this.seriesRepository.remove(series);
    return true;
  }
}
