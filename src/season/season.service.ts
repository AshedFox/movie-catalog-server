import { Injectable } from '@nestjs/common';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { SeasonModel } from './entities/season.model';
import { PaginatedSeasons } from './dto/paginated-seasons.result';
import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeasonPosterService } from '../season-poster/season-poster.service';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(SeasonModel)
    private readonly seasonRepository: Repository<SeasonModel>,
    private readonly seasonPosterService: SeasonPosterService,
  ) {}

  async create(createSeasonInput: CreateSeasonInput): Promise<SeasonModel> {
    const season = await this.seasonRepository.save(createSeasonInput);
    const { postersIds } = createSeasonInput;
    if (postersIds) {
      await this.seasonPosterService.createSeasonPosters(season.id, postersIds);
    }
    return season;
  }

  async readAll(
    take: number,
    skip: number,
    title?: string,
    seriesId?: string,
  ): Promise<PaginatedSeasons> {
    const [data, count] = await this.seasonRepository.findAndCount({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        seriesId,
      },
      take,
      skip,
      order: {
        publicationDate: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  }

  async readAllByIds(ids: string[]): Promise<SeasonModel[]> {
    return this.seasonRepository.findBy({ id: In(ids) });
  }

  async readSeasonsBySeries(seriesIds: string[]): Promise<SeasonModel[]> {
    return this.seasonRepository.findBy({ seriesId: In(seriesIds) });
  }

  async readOne(id: string): Promise<SeasonModel> {
    const season = await this.seasonRepository.findOneBy({ id });
    if (!season) {
      throw new NotFoundError();
    }
    return season;
  }

  async update(
    id: string,
    updateSeasonInput: UpdateSeasonInput,
  ): Promise<SeasonModel> {
    const season = await this.seasonRepository.findOneBy({ id });
    if (!season) {
      throw new NotFoundError();
    }
    return this.seasonRepository.save({
      ...season,
      ...updateSeasonInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const season = await this.seasonRepository.findOneBy({ id });
    if (!season) {
      throw new NotFoundError();
    }
    await this.seasonRepository.remove(season);
    return true;
  }
}
