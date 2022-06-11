import { Injectable } from '@nestjs/common';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeModel } from './entities/episode.model';
import { ILike } from 'typeorm';
import { PaginatedEpisodes } from './dto/paginated-episodes.result';

@Injectable()
export class EpisodeService {
  async create(createEpisodeInput: CreateEpisodeInput): Promise<EpisodeModel> {
    const episode = await EpisodeModel.create(createEpisodeInput);
    return episode.save();
  }

  async readAll(
    title: string,
    seasonId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedEpisodes> {
    const [data, count] = await EpisodeModel.findAndCount({
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

  async readOne(id: string): Promise<EpisodeModel> {
    return EpisodeModel.findOne(id);
  }

  async update(
    id: string,
    updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<EpisodeModel> {
    await EpisodeModel.update(id, updateEpisodeInput);
    return EpisodeModel.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await EpisodeModel.delete(id));
  }
}
