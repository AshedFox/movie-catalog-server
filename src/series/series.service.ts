import { Injectable } from '@nestjs/common';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { ILike } from 'typeorm';
import { PaginatedSeries } from './dto/paginated-series.result';

@Injectable()
export class SeriesService {
  async create(createSeriesInput: CreateSeriesInput): Promise<SeriesModel> {
    const series = await SeriesModel.create(createSeriesInput);
    return series.save();
  }

  async readAll(
    title: string,
    take: number,
    skip: number,
  ): Promise<PaginatedSeries> {
    const [data, count] = await SeriesModel.findAndCount({
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

  async readOne(id: string): Promise<SeriesModel> {
    return SeriesModel.findOne(id);
  }

  async update(
    id: string,
    updateSeriesInput: UpdateSeriesInput,
  ): Promise<SeriesModel> {
    await SeriesModel.update(id, updateSeriesInput);
    return SeriesModel.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await SeriesModel.delete(id));
  }
}
