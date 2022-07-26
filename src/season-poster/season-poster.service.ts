import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeasonPosterModel } from './entities/season-poster.model';
import { SeasonService } from '../season/season.service';

@Injectable()
export class SeasonPosterService {
  constructor(
    @InjectRepository(SeasonPosterModel)
    private readonly seasonPosterRepository: Repository<SeasonPosterModel>,
    @Inject(forwardRef(() => SeasonService))
    private readonly seasonService: SeasonService,
    @Inject(forwardRef(() => ImageService))
    private readonly posterService: ImageService,
  ) {}

  async create(seasonId: string, imageId: string) {
    await this.seasonService.readOne(seasonId);
    await this.posterService.readOne(imageId);
    const seasonPoster = await this.seasonPosterRepository.findOne({
      seasonId,
      imageId,
    });
    if (seasonPoster) {
      throw new AlreadyExistsError(
        `Poster with image id "${imageId}" already exists for season with id "${seasonId}"`,
      );
    }
    return this.seasonPosterRepository.save({ seasonId, imageId });
  }

  async createSeasonPosters(
    seasonId: string,
    postersIds: string[],
  ): Promise<SeasonPosterModel[]> {
    return this.seasonPosterRepository.save(
      postersIds.map((imageId) => ({ seasonId, imageId })),
    );
  }

  async readAll(): Promise<SeasonPosterModel[]> {
    return this.seasonPosterRepository.find();
  }

  async readSeasonsPosters(seasonsIds: string[]): Promise<SeasonPosterModel[]> {
    return this.seasonPosterRepository.find({
      where: { seasonId: In(seasonsIds) },
      relations: ['image'],
    });
  }

  async readOne(seasonId: string, imageId: string): Promise<SeasonPosterModel> {
    const seasonPoster = await this.seasonPosterRepository.findOne({
      seasonId,
      imageId,
    });
    if (!seasonPoster) {
      throw new NotFoundError();
    }
    return seasonPoster;
  }

  async delete(seasonId: string, imageId: string) {
    const seasonPoster = await this.seasonPosterRepository.findOne({
      seasonId,
      imageId,
    });
    if (!seasonPoster) {
      throw new NotFoundError();
    }
    await this.seasonPosterRepository.remove(seasonPoster);
    return true;
  }
}
