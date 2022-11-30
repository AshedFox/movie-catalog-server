import { Injectable } from '@nestjs/common';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { GqlOffsetPagination } from '@common/pagination';
import { Repository } from 'typeorm';
import { UpdateMoviePersonTypeInput } from './dto/update-movie-person-type.input';
import { MoviePersonTypeEntity } from './entities/movie-person-type.entity';
import { CreateMoviePersonTypeInput } from './dto/create-movie-person-type.input';
import { PaginatedMoviePersonTypes } from './dto/paginated-movie-person-types';

@Injectable()
export class MoviePersonTypeService {
  constructor(
    @InjectRepository(MoviePersonTypeEntity)
    private readonly moviePersonTypeRepository: Repository<MoviePersonTypeEntity>,
  ) {}

  create = async (createMoviePersonTypeInput: CreateMoviePersonTypeInput) => {
    const { name } = createMoviePersonTypeInput;
    const moviePersonType = await this.moviePersonTypeRepository.findOneBy({
      name,
    });
    if (moviePersonType) {
      throw new AlreadyExistsError(
        `Age restriction with name "${name}" already exists!`,
      );
    }
    return this.moviePersonTypeRepository.save(createMoviePersonTypeInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<MoviePersonTypeEntity>,
    filter?: FilterType<MoviePersonTypeEntity>,
  ): Promise<PaginatedMoviePersonTypes> => {
    const qb = parseArgsToQuery(
      this.moviePersonTypeRepository,
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

  readOne = async (id: number): Promise<MoviePersonTypeEntity> => {
    const moviePersonType = await this.moviePersonTypeRepository.findOneBy({
      id,
    });
    if (!moviePersonType) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    return moviePersonType;
  };

  update = async (
    id: number,
    updateMoviePersonTypeInput: UpdateMoviePersonTypeInput,
  ): Promise<MoviePersonTypeEntity> => {
    const moviePersonType = await this.moviePersonTypeRepository.findOneBy({
      id,
    });
    if (!moviePersonType) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    return this.moviePersonTypeRepository.save({
      ...moviePersonType,
      ...updateMoviePersonTypeInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const moviePersonType = await this.moviePersonTypeRepository.findOneBy({
      id,
    });
    if (!moviePersonType) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    await this.moviePersonTypeRepository.remove(moviePersonType);
    return true;
  };
}
