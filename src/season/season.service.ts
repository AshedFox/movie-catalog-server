import { Injectable } from '@nestjs/common';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { SeasonEntity } from './entities/season.entity';
import { PaginatedSeasons } from './dto/paginated-seasons';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(SeasonEntity)
    private readonly seasonRepository: Repository<SeasonEntity>,
  ) {}

  create = async (
    createSeasonInput: CreateSeasonInput,
  ): Promise<SeasonEntity> => this.seasonRepository.save(createSeasonInput);

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<SeasonEntity>,
    filter?: FilterType<SeasonEntity>,
  ): Promise<PaginatedSeasons> => {
    const qb = parseArgsToQuery(
      this.seasonRepository,
      pagination,
      sort,
      filter,
    );
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyByIds = async (ids: string[]): Promise<SeasonEntity[]> =>
    this.seasonRepository.findBy({ id: In(ids) });

  readManyBySeries = async (seriesIds: string[]): Promise<SeasonEntity[]> =>
    this.seasonRepository.findBy({ seriesId: In(seriesIds) });

  readOne = async (id: string): Promise<SeasonEntity> => {
    const season = await this.seasonRepository.findOneBy({ id });
    if (!season) {
      throw new NotFoundError(`Season with id "${id}" not found!`);
    }
    return season;
  };

  update = async (
    id: string,
    updateSeasonInput: UpdateSeasonInput,
  ): Promise<SeasonEntity> => {
    const season = await this.seasonRepository.findOneBy({ id });
    if (!season) {
      throw new NotFoundError(`Season with id "${id}" not found!`);
    }
    return this.seasonRepository.save({
      ...season,
      ...updateSeasonInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const season = await this.seasonRepository.findOneBy({ id });
    if (!season) {
      throw new NotFoundError(`Season with id "${id}" not found!`);
    }
    await this.seasonRepository.remove(season);
    return true;
  };
}
