import { Injectable } from '@nestjs/common';
import { MovieImageTypeEntity } from './entities/movie-image-type.entity';
import { PaginatedMovieImageTypes } from './dto/paginated-movie-image-types';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { GqlOffsetPagination } from '@common/pagination';
import { CreateMovieImageTypeInput } from './dto/create-movie-image-type.input';
import { UpdateMovieImageTypeInput } from './dto/update-movie-image-type.input';
import { Repository } from 'typeorm';

@Injectable()
export class MovieImageTypeService {
  constructor(
    @InjectRepository(MovieImageTypeEntity)
    private readonly movieImageTypeRepository: Repository<MovieImageTypeEntity>,
  ) {}

  create = async (createMovieImageTypeInput: CreateMovieImageTypeInput) => {
    const { name } = createMovieImageTypeInput;
    const movieImageType = await this.movieImageTypeRepository.findOneBy({
      name,
    });
    if (movieImageType) {
      throw new AlreadyExistsError(
        `Age restriction with name "${name}" already exists!`,
      );
    }
    return this.movieImageTypeRepository.save(createMovieImageTypeInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<MovieImageTypeEntity>,
    filter?: FilterType<MovieImageTypeEntity>,
  ): Promise<PaginatedMovieImageTypes> => {
    const qb = parseArgsToQuery(
      this.movieImageTypeRepository,
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

  readOne = async (id: number): Promise<MovieImageTypeEntity> => {
    const movieImageType = await this.movieImageTypeRepository.findOneBy({
      id,
    });
    if (!movieImageType) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    return movieImageType;
  };

  update = async (
    id: number,
    updateMovieImageTypeInput: UpdateMovieImageTypeInput,
  ): Promise<MovieImageTypeEntity> => {
    const movieImageType = await this.movieImageTypeRepository.findOneBy({
      id,
    });
    if (!movieImageType) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    return this.movieImageTypeRepository.save({
      ...movieImageType,
      ...updateMovieImageTypeInput,
    });
  };

  delete = async (id: number): Promise<boolean> => {
    const movieImageType = await this.movieImageTypeRepository.findOneBy({
      id,
    });
    if (!movieImageType) {
      throw new NotFoundError(`Age restriction with id "${id}" not found!`);
    }
    await this.movieImageTypeRepository.remove(movieImageType);
    return true;
  };
}
