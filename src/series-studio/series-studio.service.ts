import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudioService } from '../studio/studio.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { SeriesStudioModel } from './entities/series-studio.model';
import { SeriesService } from '../series/series.service';

@Injectable()
export class SeriesStudioService {
  constructor(
    @InjectRepository(SeriesStudioModel)
    private readonly seriesStudioRepository: Repository<SeriesStudioModel>,
    @Inject(forwardRef(() => SeriesService))
    private readonly seriesService: SeriesService,
    @Inject(forwardRef(() => StudioService))
    private readonly studioService: StudioService,
  ) {}

  async create(seriesId: string, studioId: number): Promise<SeriesStudioModel> {
    await this.seriesService.readOne(seriesId);
    await this.studioService.readOne(studioId);
    const seriesStudio = await this.seriesStudioRepository.findOneBy({
      seriesId,
      studioId,
    });
    if (seriesStudio) {
      throw new AlreadyExistsError(
        `Studio with id "${studioId}" already exists for series with id "${seriesId}"`,
      );
    }
    return this.seriesStudioRepository.save({ seriesId, studioId });
  }

  async createSeriesStudios(
    seriesId: string,
    studiosIds: number[],
  ): Promise<SeriesStudioModel[]> {
    return this.seriesStudioRepository.save(
      studiosIds.map((studioId) => ({ seriesId, studioId })),
    );
  }

  async readAll(): Promise<SeriesStudioModel[]> {
    return this.seriesStudioRepository.find();
  }

  async readManySeriesStudios(
    seriesIds: string[],
  ): Promise<SeriesStudioModel[]> {
    return this.seriesStudioRepository.find({
      where: { seriesId: In(seriesIds) },
      relations: {
        studio: true,
      },
    });
  }

  async readOne(
    seriesId: string,
    studioId: number,
  ): Promise<SeriesStudioModel> {
    const seriesStudio = await this.seriesStudioRepository.findOneBy({
      seriesId,
      studioId,
    });
    if (!seriesStudio) {
      throw new NotFoundError();
    }
    return seriesStudio;
  }

  async delete(seriesId: string, studioId: number): Promise<boolean> {
    const seriesStudio = await this.seriesStudioRepository.findOneBy({
      seriesId,
      studioId,
    });
    if (!seriesStudio) {
      throw new NotFoundError();
    }
    await this.seriesStudioRepository.remove(seriesStudio);
    return true;
  }
}
