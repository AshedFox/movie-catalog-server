import { Injectable } from '@nestjs/common';
import { VideoEntity } from './entities/video.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { CreateVideoInput } from './dto/create-video.input';
import { VideoVariantEntity } from '../video-variant/entities/video-variant.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  count = async (filter?: FilterType<VideoEntity>): Promise<number> => {
    return parseArgsToQuery(
      this.videoRepository,
      undefined,
      undefined,
      filter,
    ).getCount();
  };

  create = async (input: CreateVideoInput): Promise<VideoEntity> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const video = await queryRunner.manager.save(
        VideoEntity,
        {} as CreateVideoInput,
      );

      video.variants = await queryRunner.manager.save(
        VideoVariantEntity,
        input.variants.map((v) => ({ ...v, videoId: video.id })),
      );

      await queryRunner.commitTransaction();
      return video;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  readOne = async (id: number): Promise<VideoEntity> => {
    const entity = await this.videoRepository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundError(`Video with id ${id} not found!`);
    }

    return entity;
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<VideoEntity>,
    filter?: FilterType<VideoEntity>,
  ): Promise<VideoEntity[]> => {
    return parseArgsToQuery(
      this.videoRepository,
      pagination,
      sort,
      filter,
    ).getMany();
  };

  readManyByIds = async (ids: number[]): Promise<VideoEntity[]> => {
    return this.videoRepository.findBy({ id: In(ids) });
  };

  delete = async (id: number): Promise<VideoEntity> => {
    const entity = await this.readOne(id);

    return this.videoRepository.remove(entity);
  };
}
