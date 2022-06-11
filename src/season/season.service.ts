import { Injectable } from '@nestjs/common';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { SeasonModel } from './entities/season.model';
import { PaginatedSeasons } from './dto/paginated-seasons.result';
import { ILike } from 'typeorm';

@Injectable()
export class SeasonService {
  async create(createSeasonInput: CreateSeasonInput): Promise<SeasonModel> {
    const season = await SeasonModel.create(createSeasonInput);
    return season.save();
  }

  async readAll(
    title: string,
    seriesId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedSeasons> {
    const [data, count] = await SeasonModel.findAndCount({
      where: [
        title
          ? {
              title: ILike(`%${title}%`),
            }
          : {},
        seriesId ? { seriesId } : {},
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

  async readOne(id: string): Promise<SeasonModel> {
    return SeasonModel.findOne(id);
  }

  async update(
    id: string,
    updateSeasonInput: UpdateSeasonInput,
  ): Promise<SeasonModel> {
    await SeasonModel.update(id, updateSeasonInput);
    return SeasonModel.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await SeasonModel.delete(id));
  }
}
