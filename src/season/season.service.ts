import { Injectable } from '@nestjs/common';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { SeasonModel } from './entities/season.model';
import { PaginatedSeasons } from './dto/paginated-seasons.result';
import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(SeasonModel)
    private readonly seasonRepository: Repository<SeasonModel>,
  ) {}

  async create(createSeasonInput: CreateSeasonInput): Promise<SeasonModel> {
    return this.seasonRepository.save(createSeasonInput);
  }

  async readAll(
    title: string,
    seriesId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedSeasons> {
    const [data, count] = await this.seasonRepository.findAndCount({
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

  async readAllByIds(ids: string[]): Promise<SeasonModel[]> {
    return this.seasonRepository.findByIds(ids);
  }

  async readSeasonsBySeries(seriesIds: string[]): Promise<SeasonModel[]> {
    return this.seasonRepository.find({
      seriesId: In(seriesIds),
    });
  }

  async readOne(id: string): Promise<SeasonModel> {
    const season = await this.seasonRepository.findOne(id);
    if (!season) {
      throw new NotFoundError();
    }
    return season;
  }

  async update(
    id: string,
    updateSeasonInput: UpdateSeasonInput,
  ): Promise<SeasonModel> {
    const season = await this.seasonRepository.findOne(id);
    if (!season) {
      throw new NotFoundError();
    }
    return this.seasonRepository.save({
      ...season,
      ...updateSeasonInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const season = await this.seasonRepository.findOne(id);
    if (!season) {
      throw new NotFoundError();
    }
    await this.seasonRepository.remove(season);
    return true;
  }
}
