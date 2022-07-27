import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeriesPosterModel } from './entities/series-poster.model';
import { SeriesService } from '../series/series.service';

@Injectable()
export class SeriesPosterService {
  constructor(
    @InjectRepository(SeriesPosterModel)
    private readonly seriesPosterRepository: Repository<SeriesPosterModel>,
    @Inject(forwardRef(() => SeriesService))
    private readonly seriesService: SeriesService,
    @Inject(forwardRef(() => ImageService))
    private readonly posterService: ImageService,
  ) {}

  async create(seriesId: string, imageId: string) {
    await this.seriesService.readOne(seriesId);
    await this.posterService.readOne(imageId);
    const seriesPoster = await this.seriesPosterRepository.findOneBy({
      seriesId,
      imageId,
    });
    if (seriesPoster) {
      throw new AlreadyExistsError(
        `Poster with image id "${imageId}" already exists for series with id "${seriesId}"`,
      );
    }
    return this.seriesPosterRepository.save({ seriesId, imageId });
  }

  async createSeriesPosters(
    seriesId: string,
    postersIds: string[],
  ): Promise<SeriesPosterModel[]> {
    return this.seriesPosterRepository.save(
      postersIds.map((imageId) => ({ seriesId, imageId })),
    );
  }

  async readAll(): Promise<SeriesPosterModel[]> {
    return this.seriesPosterRepository.find();
  }

  async readSeriesPosters(seriesIds: string[]): Promise<SeriesPosterModel[]> {
    return this.seriesPosterRepository.find({
      where: { seriesId: In(seriesIds) },
      relations: {
        image: true,
      },
    });
  }

  async readOne(seriesId: string, imageId: string): Promise<SeriesPosterModel> {
    const seriesPoster = await this.seriesPosterRepository.findOneBy({
      seriesId,
      imageId,
    });
    if (!seriesPoster) {
      throw new NotFoundError();
    }
    return seriesPoster;
  }

  async delete(seriesId: string, imageId: string) {
    const seriesPoster = await this.seriesPosterRepository.findOneBy({
      seriesId,
      imageId,
    });
    if (!seriesPoster) {
      throw new NotFoundError();
    }
    await this.seriesPosterRepository.remove(seriesPoster);
    return true;
  }
}
