import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';
import { NotFoundError } from '../shared/errors/not-found.error';
import { VideoQualityModel } from './entities/video-quality.model';
import { VideoService } from '../video/video.service';
import { QualityService } from '../quality/quality.service';

@Injectable()
export class VideoQualityService {
  constructor(
    @InjectRepository(VideoQualityModel)
    private readonly videoQualityRepository: Repository<VideoQualityModel>,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => QualityService))
    private readonly qualityService: QualityService,
  ) {}

  async create(videoId: string, qualityId: number): Promise<VideoQualityModel> {
    await this.videoService.readOne(videoId);
    await this.qualityService.readOne(qualityId);
    const videoQuality = await this.videoQualityRepository.findOne({
      videoId,
      qualityId,
    });
    if (videoQuality) {
      throw new AlreadyExistsError(
        `Quality with id "${qualityId}" already exists for video with id "${videoId}"`,
      );
    }
    return this.videoQualityRepository.save({ videoId, qualityId });
  }

  async createVideoQualities(
    videoId: string,
    qualitiesIds: number[],
  ): Promise<VideoQualityModel[]> {
    return this.videoQualityRepository.save(
      qualitiesIds.map((qualityId) => ({ qualityId, videoId })),
    );
  }

  async readAll(): Promise<VideoQualityModel[]> {
    return this.videoQualityRepository.find();
  }

  async readVideosQualities(videosIds: string[]): Promise<VideoQualityModel[]> {
    return this.videoQualityRepository.find({
      where: { videoId: In(videosIds) },
      relations: ['quality'],
    });
  }

  async readOne(
    videoId: string,
    qualityId: number,
  ): Promise<VideoQualityModel> {
    const videoQuality = await this.videoQualityRepository.findOne({
      videoId,
      qualityId,
    });
    if (!videoQuality) {
      throw new NotFoundError();
    }
    return videoQuality;
  }

  async delete(videoId: string, qualityId: number): Promise<boolean> {
    const videoQuality = await this.videoQualityRepository.findOne({
      videoId,
      qualityId,
    });
    if (!videoQuality) {
      throw new NotFoundError();
    }
    await this.videoQualityRepository.remove(videoQuality);
    return true;
  }
}
