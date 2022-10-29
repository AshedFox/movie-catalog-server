import { Injectable } from '@nestjs/common';
import { CreateImageInput } from './dto/create-image.input';
import { In, Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { AlreadyExistsError } from '../utils/errors/already-exists.error';
import { GqlOffsetPagination } from '../common/pagination';
import { SortType } from '../common/sort';
import { FilterType } from '../common/filter';
import { parseArgs } from '../common/typeorm-query-parser';
import { PaginatedImages } from './dto/paginated-images';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  create = async (createImageInput: CreateImageInput): Promise<ImageEntity> => {
    const existingImage = await this.imageRepository.findOneBy({
      url: createImageInput.url,
    });
    if (existingImage) {
      throw new AlreadyExistsError(
        `Image with url "${createImageInput.url}" already exists!`,
      );
    }
    return this.imageRepository.save(createImageInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<ImageEntity>,
    filter?: FilterType<ImageEntity>,
  ): Promise<PaginatedImages> => {
    const qb = parseArgs(
      this.imageRepository.createQueryBuilder(),
      pagination,
      sort,
      filter,
    );

    const [data, count] = await qb.getManyAndCount();

    return { data, count, hasNext: count > pagination.take + pagination.skip };
  };

  readOne = async (id: string): Promise<ImageEntity> => {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundError(`Image with id "${id}" not found!`);
    }
    return image;
  };

  readManyByIds = async (ids: string[]): Promise<ImageEntity[]> =>
    this.imageRepository.findBy({ id: In(ids) });

  delete = async (id: string): Promise<boolean> => {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundError(`Image with id "${id}" not found!`);
    }
    await this.imageRepository.remove(image);
    return true;
  };
}
