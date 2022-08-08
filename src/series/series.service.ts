import { Injectable } from '@nestjs/common';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesEntity } from './entities/series.entity';
import { ILike, In, Repository } from 'typeorm';
import { PaginatedSeries } from './dto/paginated-series';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import { MovieStudioService } from '../movie-studio/movie-studio.service';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SeriesEntity)
    private readonly seriesRepository: Repository<SeriesEntity>,
    private readonly movieGenreService: MovieGenreService,
    private readonly movieStudioService: MovieStudioService,
  ) {}

  create = async (
    createSeriesInput: CreateSeriesInput,
  ): Promise<SeriesEntity> => {
    const series = await this.seriesRepository.save(createSeriesInput);
    const { genresIds, studiosIds } = createSeriesInput;
    if (genresIds) {
      await this.movieGenreService.createManyForMovie(series.id, genresIds);
    }
    if (studiosIds) {
      await this.movieStudioService.createManyForMovie(series.id, studiosIds);
    }
    return series;
  };

  readMany = async (
    take: number,
    skip: number,
    title?: string,
  ): Promise<PaginatedSeries> => {
    const [data, count] = await this.seriesRepository.findAndCount({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
      },
      take,
      skip,
      order: {
        createdAt: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  };

  readManyByIds = async (ids: string[]): Promise<SeriesEntity[]> =>
    await this.seriesRepository.findBy({ id: In(ids) });

  readOne = async (id: string): Promise<SeriesEntity> => {
    const series = await this.seriesRepository.findOneBy({ id });
    if (!series) {
      throw new NotFoundError(`Series with id "${id}" not found!`);
    }
    return series;
  };

  update = async (
    id: string,
    updateSeriesInput: UpdateSeriesInput,
  ): Promise<SeriesEntity> => {
    const series = await this.seriesRepository.findOneBy({ id });
    if (!series) {
      throw new NotFoundError(`Series with id "${id}" not found!`);
    }
    return this.seriesRepository.save({
      ...series,
      ...updateSeriesInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const series = await this.seriesRepository.findOneBy({ id });
    if (!series) {
      throw new NotFoundError(`Series with id "${id}" not found!`);
    }
    await this.seriesRepository.remove(series);
    return true;
  };
}
