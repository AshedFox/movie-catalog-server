import { Injectable } from '@nestjs/common';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioEntity } from './entities/studio.entity';
import { In, Repository } from 'typeorm';
import { PaginatedStudios } from './dto/paginated-studios';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';
import { StudioCountryService } from '../studio-country/studio-country.service';
import { GqlOffsetPagination } from '../common/pagination';
import { SortType } from '../common/sort';
import { FilterType } from '../common/filter';
import { parseArgs } from '../common/typeorm-query-parser';

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(StudioEntity)
    private readonly studioRepository: Repository<StudioEntity>,
    private readonly studioCountryService: StudioCountryService,
  ) {}

  create = async (
    createStudioInput: CreateStudioInput,
  ): Promise<StudioEntity> => {
    const studio = await this.studioRepository.save(createStudioInput);
    const { countriesIds } = createStudioInput;
    if (countriesIds) {
      await this.studioCountryService.createManyForStudio(
        studio.id,
        countriesIds,
      );
    }
    return studio;
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<StudioEntity>,
    filter?: FilterType<StudioEntity>,
  ): Promise<PaginatedStudios> => {
    const qb = parseArgs(
      this.studioRepository.createQueryBuilder(),
      pagination,
      sort,
      filter,
    );
    const [data, count] = await qb.getManyAndCount();

    return { data, count, hasNext: count > pagination.take + pagination.skip };
  };

  readManyByIds = async (ids: number[]): Promise<StudioEntity[]> =>
    await this.studioRepository.findBy({ id: In(ids) });

  readOne = async (id: number): Promise<StudioEntity> => {
    const studio = await this.studioRepository.findOneBy({ id });
    if (!studio) {
      throw new NotFoundError(`Studio with id "${id}" not found!`);
    }
    return studio;
  };

  update = async (
    id: number,
    updateStudioInput: UpdateStudioInput,
  ): Promise<StudioEntity> => {
    const studio = await this.studioRepository.findOneBy({ id });
    if (!studio) {
      throw new NotFoundError(`Studio with id "${id}" not found!`);
    }
    return this.studioRepository.save({
      ...studio,
      ...updateStudioInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const studio = await this.studioRepository.findOneBy({ id });
    if (!studio) {
      throw new NotFoundError(`Studio with id "${id}" not found!`);
    }
    await this.studioRepository.remove(studio);
    return true;
  };
}
