import { Injectable } from '@nestjs/common';
import { AlreadyExistsError } from '@utils/errors';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeEntity } from './entities/episode.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class EpisodeService extends BaseService<
  EpisodeEntity,
  CreateEpisodeInput,
  UpdateEpisodeInput
> {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodeRepository: Repository<EpisodeEntity>,
  ) {
    super(episodeRepository);
  }

  create = async (
    createEpisodeInput: CreateEpisodeInput,
  ): Promise<EpisodeEntity> => {
    const { seriesId, numberInSeries } = createEpisodeInput;

    const episode = await this.episodeRepository.findOneBy({
      seriesId,
      numberInSeries,
    });

    if (episode) {
      throw new AlreadyExistsError(
        `Episode with seriesId "${seriesId}" and numberInSeries "${numberInSeries}" already exists!`,
      );
    }
    return this.episodeRepository.save(createEpisodeInput);
  };

  readManyBySeries = async (seriesIds: string[]): Promise<EpisodeEntity[]> =>
    this.episodeRepository.findBy({
      seriesId: In(seriesIds),
    });

  readManyBySeasons = async (seasonsIds: string[]): Promise<EpisodeEntity[]> =>
    this.episodeRepository.findBy({
      seasonId: In(seasonsIds),
    });
}
