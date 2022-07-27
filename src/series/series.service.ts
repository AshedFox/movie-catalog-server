import { Injectable } from '@nestjs/common';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { PaginatedSeries } from './dto/paginated-series.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeriesStudioService } from '../series-studio/series-studio.service';
import { SeriesGenreService } from '../series-genre/series-genre.service';
import { SeriesPosterService } from '../series-poster/series-poster.service';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SeriesModel)
    private readonly seriesRepository: Repository<SeriesModel>,
    private readonly seriesGenreService: SeriesGenreService,
    private readonly seriesStudioService: SeriesStudioService,
    private readonly seriesPosterService: SeriesPosterService,
  ) {}

  async create(createSeriesInput: CreateSeriesInput): Promise<SeriesModel> {
    const series = await this.seriesRepository.save(createSeriesInput);
    const { genresIds, studiosIds, postersIds } = createSeriesInput;
    if (genresIds) {
      await this.seriesGenreService.createSeriesGenres(series.id, genresIds);
    }
    if (studiosIds) {
      await this.seriesStudioService.createSeriesStudios(series.id, studiosIds);
    }
    if (postersIds) {
      await this.seriesPosterService.createSeriesPosters(series.id, postersIds);
    }
    return series;
  }

  async readAll(
    title: string,
    take: number,
    skip: number,
  ): Promise<PaginatedSeries> {
    let where: FindOptionsWhere<SeriesModel> = {};
    if (title) {
      where = { ...where, title: ILike(`%${title}%`) };
    }
    const [data, count] = await this.seriesRepository.findAndCount({
      where,
      take,
      skip,
      order: {
        publicationDate: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  }

  async readAllByIds(ids: string[]): Promise<SeriesModel[]> {
    return await this.seriesRepository.findBy({ id: In(ids) });
  }

  async readOne(id: string): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOneBy({ id });
    if (!series) {
      throw new NotFoundError();
    }
    return series;
  }

  async update(
    id: string,
    updateSeriesInput: UpdateSeriesInput,
  ): Promise<SeriesModel> {
    const series = await this.seriesRepository.findOneBy({ id });
    if (!series) {
      throw new NotFoundError();
    }
    return this.seriesRepository.save({
      ...series,
      ...updateSeriesInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const series = await this.seriesRepository.findOneBy({ id });
    if (!series) {
      throw new NotFoundError();
    }
    await this.seriesRepository.remove(series);
    return true;
  }
}
