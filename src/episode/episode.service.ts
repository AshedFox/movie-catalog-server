import { Injectable } from '@nestjs/common';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeEntity } from './entities/episode.entity';
import { ILike, In, Repository } from 'typeorm';
import { PaginatedEpisodes } from './dto/paginated-episodes';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';

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
    take: number,
    skip: number,
    title?: string,
    seasonId?: string,
    seriesId?: string,
  ): Promise<PaginatedEpisodes> => {
    const [data, count] = await this.episodeRepository.findAndCount({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        seasonId,
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
