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
    title: string,
    seasonId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedEpisodes> {
    const [data, count] = await this.episodeRepository.findAndCount({
      where: [
        title
          ? {
              title: ILike(`%${title}%`),
            }
          : {},
        seasonId
          ? {
              seasonId,
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

  async readAllByIds(ids: string[]): Promise<EpisodeModel[]> {
    return this.episodeRepository.findByIds(ids);
  }

  async readManySeriesEpisodes(seriesIds: string[]): Promise<EpisodeModel[]> {
    return this.episodeRepository.find({
      seriesId: In(seriesIds),
    });
  }

  async readSeasonsEpisodes(seasonsIds: string[]): Promise<EpisodeModel[]> {
    return this.episodeRepository.find({
      seasonId: In(seasonsIds),
    });
  }

  async readOne(id: string): Promise<EpisodeModel> {
    const episode = await this.episodeRepository.findOne(id);
    if (!episode) {
      throw new NotFoundError();
    }
    return episode;
  }

  async update(
    id: string,
    updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<EpisodeModel> {
    const episode = await this.episodeRepository.findOne(id);
    if (!episode) {
      throw new NotFoundError();
    }
    return this.episodeRepository.save({
      ...episode,
      ...updateEpisodeInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const episode = await this.episodeRepository.findOne(id);
    if (!episode) {
      throw new NotFoundError();
    }
    await this.episodeRepository.remove(episode);
    return true;
  }
}
