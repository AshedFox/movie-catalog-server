import { Injectable } from '@nestjs/common';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeModel } from './entities/episode.model';
import { ILike, In, Repository } from 'typeorm';
import { PaginatedEpisodes } from './dto/paginated-episodes.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { EpisodePosterService } from '../episode-poster/episode-poster.service';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(EpisodeModel)
    private readonly episodeRepository: Repository<EpisodeModel>,
    private readonly episodePosterService: EpisodePosterService,
  ) {}

  async create(createEpisodeInput: CreateEpisodeInput): Promise<EpisodeModel> {
    const episode = await this.episodeRepository.save(createEpisodeInput);
    const { postersIds } = createEpisodeInput;
    if (postersIds) {
      await this.episodePosterService.createEpisodePosters(
        episode.id,
        postersIds,
      );
    }
    return episode;
  }

  async readAll(
    take: number,
    skip: number,
    title?: string,
    seasonId?: string,
  ): Promise<PaginatedEpisodes> {
    const [data, count] = await this.episodeRepository.findAndCount({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        seasonId,
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

  async readAllByIds(ids: string[]): Promise<EpisodeModel[]> {
    return this.episodeRepository.findBy({ id: In(ids) });
  }

  async readManySeriesEpisodes(seriesIds: string[]): Promise<EpisodeModel[]> {
    return this.episodeRepository.findBy({
      seriesId: In(seriesIds),
    });
  }

  async readSeasonsEpisodes(seasonsIds: string[]): Promise<EpisodeModel[]> {
    return this.episodeRepository.findBy({
      seasonId: In(seasonsIds),
    });
  }

  async readOne(id: string): Promise<EpisodeModel> {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundError();
    }
    return episode;
  }

  async update(
    id: string,
    updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<EpisodeModel> {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundError();
    }
    return this.episodeRepository.save({
      ...episode,
      ...updateEpisodeInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundError();
    }
    await this.episodeRepository.remove(episode);
    return true;
  }
}
