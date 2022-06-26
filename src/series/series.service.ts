import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { ILike, Repository } from 'typeorm';
import { PaginatedSeries } from './dto/paginated-series.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeriesStudioService } from '../series-studio/series-studio.service';
import { SeriesGenreService } from '../series-genre/series-genre.service';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SeriesModel)
    private readonly seriesRepository: Repository<SeriesModel>,
    @Inject(forwardRef(() => SeriesGenreService))
    private readonly seriesGenreService: SeriesGenreService,
    @Inject(forwardRef(() => SeriesStudioService))
    private readonly seriesStudioService: SeriesStudioService,
  ) {}

  async create(createSeriesInput: CreateSeriesInput): Promise<SeriesModel> {
    const series = await this.seriesRepository.save(createSeriesInput);
    const { genresIds, studiosIds } = createSeriesInput;
    if (genresIds && genresIds.length > 0) {
      await this.seriesGenreService.createSeriesGenres(series.id, genresIds);
    }
    if (studiosIds && studiosIds.length > 0) {
      await this.seriesStudioService.createSeriesStudios(series.id, studiosIds);
    }
    return series;
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

  async delete(id: string): Promise<boolean> {
    const series = await this.seriesRepository.findOne(id);
    if (!series) {
      throw new NotFoundError();
    }
    await this.seriesRepository.remove(series);
    return true;
  }
}
