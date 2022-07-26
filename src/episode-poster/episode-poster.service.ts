import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { EpisodePosterModel } from './entities/episode-poster.model';
import { EpisodeService } from '../episode/episode.service';

@Injectable()
export class EpisodePosterService {
  constructor(
    @InjectRepository(EpisodePosterModel)
    private readonly episodePosterRepository: Repository<EpisodePosterModel>,
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService,
    @Inject(forwardRef(() => ImageService))
    private readonly posterService: ImageService,
  ) {}

  async create(episodeId: string, imageId: string) {
    await this.episodeService.readOne(episodeId);
    await this.posterService.readOne(imageId);
    const episodePoster = await this.episodePosterRepository.findOne({
      episodeId,
      imageId,
    });
    if (episodePoster) {
      throw new AlreadyExistsError(
        `Poster with image id "${imageId}" already exists for episode with id "${episodeId}"`,
      );
    }
    return this.episodePosterRepository.save({ episodeId, imageId });
  }

  async createEpisodePosters(
    episodeId: string,
    postersIds: string[],
  ): Promise<EpisodePosterModel[]> {
    return this.episodePosterRepository.save(
      postersIds.map((imageId) => ({ episodeId, imageId })),
    );
  }

  async readAll(): Promise<EpisodePosterModel[]> {
    return this.episodePosterRepository.find();
  }

  async readEpisodesPosters(
    episodesIds: string[],
  ): Promise<EpisodePosterModel[]> {
    return this.episodePosterRepository.find({
      where: { episodeId: In(episodesIds) },
      relations: ['image'],
    });
  }

  async readOne(
    episodeId: string,
    imageId: string,
  ): Promise<EpisodePosterModel> {
    const episodePoster = await this.episodePosterRepository.findOne({
      episodeId,
      imageId,
    });
    if (!episodePoster) {
      throw new NotFoundError();
    }
    return episodePoster;
  }

  async delete(episodeId: string, imageId: string) {
    const episodePoster = await this.episodePosterRepository.findOne({
      episodeId,
      imageId,
    });
    if (!episodePoster) {
      throw new NotFoundError();
    }
    await this.episodePosterRepository.remove(episodePoster);
    return true;
  }
}
