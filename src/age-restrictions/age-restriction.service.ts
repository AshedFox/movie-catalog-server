import { Injectable } from '@nestjs/common';
import { CreateAgeRestrictionInput } from './dto/create-age-restriction.input';
import { UpdateAgeRestrictionInput } from './dto/update-age-restriction.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { AgeRestrictionEntity } from './entities/age-restriction.entity';
import { PaginatedAgeRestrictions } from './dto/paginated-age-restrictions';

@Injectable()
export class AgeRestrictionService {
  constructor(
    @InjectRepository(AgeRestrictionEntity)
    private readonly ageRestrictionRepository: Repository<AgeRestrictionEntity>,
  ) {}

  create = async (createAgeRestrictionInput: CreateAgeRestrictionInput) => {
    const { name } = createAgeRestrictionInput;
    const ageRestriction = await this.ageRestrictionRepository.findOneBy({
      name,
    });
    if (ageRestriction) {
      throw new AlreadyExistsError(
        `Age restriction with name "${name}" already exists!`,
      );
    }
    return this.ageRestrictionRepository.save(createAgeRestrictionInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<AgeRestrictionEntity>,
    filter?: FilterType<AgeRestrictionEntity>,
  ): Promise<PaginatedAgeRestrictions> => {
    const qb = parseArgsToQuery(
      this.ageRestrictionRepository,
      pagination,
      sort,
      filter,
    );
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyByIds = async (ids: number[]): Promise<AgeRestrictionEntity[]> =>
    this.ageRestrictionRepository.findBy({ id: In(ids) });

  readOne = async (id: number): Promise<AgeRestrictionEntity> => {
    const ageRestriction = await this.ageRestrictionRepository.findOneBy({
      id,
    });
    if (!ageRestriction) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    return ageRestriction;
  };

  update = async (
    id: number,
    updateAgeRestrictionInput: UpdateAgeRestrictionInput,
  ): Promise<AgeRestrictionEntity> => {
    const ageRestriction = await this.ageRestrictionRepository.findOneBy({
      id,
    });
    if (!ageRestriction) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    return this.ageRestrictionRepository.save({
      ...ageRestriction,
      ...updateAgeRestrictionInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const ageRestriction = await this.ageRestrictionRepository.findOneBy({
      id,
    });
    if (!ageRestriction) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    await this.ageRestrictionRepository.remove(ageRestriction);
    return true;
  };
}
