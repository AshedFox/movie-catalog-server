import { Injectable } from '@nestjs/common';
import { VideoEntity } from './entities/video.entity';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { CreateVideoInput } from './dto/create-video.input';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { GqlOffsetPagination } from '../common/pagination';
import { SortType } from '../common/sort';
import { FilterType } from '../common/filter';
import { parseArgs } from '../common/typeorm-query-parser';
import { PaginatedVideos } from './dto/paginated-videos';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  create = async (createVideoInput: CreateVideoInput): Promise<VideoEntity> => {
    const { url } = createVideoInput;
    const existingVideo = await this.videoRepository.findOneBy({
      url,
    });
    if (existingVideo) {
      throw new AlreadyExistsError(`Video with url "${url}" already exists!`);
    }
    return await this.videoRepository.save(createVideoInput);
  };

  readOne = async (id: string): Promise<VideoEntity> => {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) {
      throw new NotFoundError(`Video with id "${id}" not found!`);
    }
    return video;
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<VideoEntity>,
    filter?: FilterType<VideoEntity>,
  ): Promise<PaginatedVideos> => {
    const qb = parseArgs(
      this.videoRepository.createQueryBuilder(),
      pagination,
      sort,
      filter,
    );
    const [data, count] = await qb.getManyAndCount();

    return { data, count, hasNext: count > pagination.take + pagination.skip };
  };

  readManyByIds = async (ids: string[]): Promise<VideoEntity[]> =>
    this.videoRepository.findBy({ id: In(ids) });

  delete = async (id: string) => {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) {
      throw new NotFoundError(`Video with id "${id}" not found!`);
    }
    await this.videoRepository.remove(video);
    return true;
  };
}
