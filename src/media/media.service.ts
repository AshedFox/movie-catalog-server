import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '@utils/errors';
import { OffsetPaginationArgsType } from '@common/pagination/offset';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { PaginatedMedia } from './dto/paginated-media';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { CreateMediaInput } from './dto/create-media.input';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly imageRepository: Repository<MediaEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  create = async (input: CreateMediaInput): Promise<MediaEntity> => {
    let { type, file } = input;

    file = await file;

    switch (type) {
      case MediaTypeEnum.VIDEO: {
        const { url, public_id } = await this.cloudinaryService.uploadVideo(
          file,
        );
        return this.imageRepository.save({ url, publicId: public_id, type });
      }
      case MediaTypeEnum.SUBTITLES: {
        const { url, public_id } = await this.cloudinaryService.uploadSubtitles(
          file,
        );
        return this.imageRepository.save({ url, publicId: public_id, type });
      }
      case MediaTypeEnum.IMAGE: {
        const { url, public_id } = await this.cloudinaryService.uploadImage(
          file,
        );
        return this.imageRepository.save({ url, publicId: public_id, type });
      }
    }
  };

  readMany = async (
    pagination?: OffsetPaginationArgsType,
    sort?: SortType<MediaEntity>,
    filter?: FilterType<MediaEntity>,
  ): Promise<PaginatedMedia> => {
    const qb = parseArgsToQuery(this.imageRepository, pagination, sort, filter);

    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  };

  readOne = async (id: number): Promise<MediaEntity> => {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundError(`Image with id "${id}" not found!`);
    }
    return image;
  };

  readManyByIds = async (ids: number[]): Promise<MediaEntity[]> =>
    this.imageRepository.findBy({ id: In(ids) });

  delete = async (id: number): Promise<MediaEntity> => {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundError(`Image with id "${id}" not found!`);
    }
    const removed = await this.imageRepository.remove(image);

    await this.cloudinaryService.delete(image.publicId);

    return removed;
  };
}
