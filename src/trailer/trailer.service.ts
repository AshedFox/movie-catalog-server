import { Injectable } from '@nestjs/common';
import { CreateTrailerInput } from './dto/create-trailer.input';
import { UpdateTrailerInput } from './dto/update-trailer.input';
import { InjectRepository } from '@nestjs/typeorm';
import { TrailerEntity } from './entities/trailer.entity';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { PaginatedTrailers } from './dto/paginated-trailers';

@Injectable()
export class TrailerService {
  constructor(
    @InjectRepository(TrailerEntity)
    private readonly trailerRepository: Repository<TrailerEntity>,
  ) {}

  create = async (createTrailerInput: CreateTrailerInput) => {
    const { movieId, videoId } = createTrailerInput;
    const trailer = await this.trailerRepository.findBy({
      movieId,
      videoId,
    });
    if (trailer) {
      throw new AlreadyExistsError(
        `Trailer with movieId "${movieId}" and videoId "${videoId}" already exists!`,
      );
    }
    return this.trailerRepository.save(createTrailerInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<TrailerEntity>,
    filter?: FilterType<TrailerEntity>,
  ): Promise<PaginatedTrailers> => {
    const qb = parseArgsToQuery(
      this.trailerRepository,
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

  readManyByIds = async (ids: number[]) =>
    this.trailerRepository.findBy({ id: In(ids) });

  readManyByMovies = async (moviesIds: string[]) =>
    this.trailerRepository.find({
      where: {
        movieId: In(moviesIds),
      },
    });

  readOne = async (id: number) => {
    const trailer = await this.trailerRepository.findOneBy({ id });
    if (!trailer) {
      throw new NotFoundError(`Trailer with id "${id}" not found!`);
    }
    return trailer;
  };

  update = async (id: number, updateTrailerInput: UpdateTrailerInput) => {
    const trailer = await this.trailerRepository.findOneBy({ id });
    if (!trailer) {
      throw new NotFoundError(`Trailer with id "${id}" not found!`);
    }
    return this.trailerRepository.save({ ...trailer, ...updateTrailerInput });
  };

  delete = async (id: number) => {
    const trailer = await this.trailerRepository.findOneBy({ id });
    if (!trailer) {
      throw new NotFoundError(`Trailer with id "${id}" not found!`);
    }
    await this.trailerRepository.remove(trailer);
    return true;
  };
}
