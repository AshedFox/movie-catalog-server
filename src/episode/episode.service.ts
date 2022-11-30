import { Injectable } from '@nestjs/common';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeEntity } from './entities/episode.entity';
import { In, Repository } from 'typeorm';
import { PaginatedEpisodes } from './dto/paginated-episodes';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodeRepository: Repository<EpisodeEntity>,
  ) {}

  create = async (
    createEpisodeInput: CreateEpisodeInput,
  ): Promise<EpisodeEntity> => this.episodeRepository.save(createEpisodeInput);

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<EpisodeEntity>,
    filter?: FilterType<EpisodeEntity>,
  ): Promise<PaginatedEpisodes> => {
    const qb = parseArgsToQuery(
      this.episodeRepository,
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

  readManyByIds = async (ids: string[]): Promise<EpisodeEntity[]> =>
    this.episodeRepository.findBy({ id: In(ids) });

  readManyBySeries = async (seriesIds: string[]): Promise<EpisodeEntity[]> =>
    this.episodeRepository.findBy({
      seriesId: In(seriesIds),
    });

  readManyBySeasons = async (seasonsIds: string[]): Promise<EpisodeEntity[]> =>
    this.episodeRepository.findBy({
      seasonId: In(seasonsIds),
    });

  readOne = async (id: string): Promise<EpisodeEntity> => {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundError(`Episode with id "${id}" not found!`);
    }
    return episode;
  };

  update = async (
    id: string,
    updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<EpisodeEntity> => {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundError(`Episode with id "${id}" not found!`);
    }
    return this.episodeRepository.save({
      ...episode,
      ...updateEpisodeInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundError(`Episode with id "${id}" not found!`);
    }
    await this.episodeRepository.remove(episode);
    return true;
  };
}
