import { Injectable } from '@nestjs/common';
import { CreateSeriesPersonInput } from './dto/create-series-person.input';
import { UpdateSeriesPersonInput } from './dto/update-series-person.input';
import { SeriesPersonModel } from './entities/series-person.model';
import { PersonTypeEnum } from '../shared/person-type.enum';
import { PaginatedSeriesPersons } from './dto/paginated-series-persons.result';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class SeriesPersonService {
  constructor(
    @InjectRepository(SeriesPersonModel)
    private readonly seriesPersonRepository: Repository<SeriesPersonModel>,
  ) {}

  async create(
    createSeriesPersonInput: CreateSeriesPersonInput,
  ): Promise<SeriesPersonModel> {
    return this.seriesPersonRepository.save(createSeriesPersonInput);
  }

  async readAll(
    take: number,
    skip: number,
    seriesId?: string,
    personId?: number,
    type?: PersonTypeEnum,
  ): Promise<PaginatedSeriesPersons> {
    const [data, count] = await this.seriesPersonRepository.findAndCount({
      where: [
        seriesId ? { seriesId } : {},
        personId ? { personId } : {},
        type ? { type } : {},
      ],
      take,
      skip,
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readAllByIds(ids: string[]): Promise<SeriesPersonModel[]> {
    return await this.seriesPersonRepository.findByIds(ids);
  }

  async readSeriesPersons(seriesIds: string[]): Promise<SeriesPersonModel[]> {
    return this.seriesPersonRepository.find({
      where: { seriesId: In(seriesIds) },
    });
  }

  async readOne(id: number): Promise<SeriesPersonModel> {
    const seriesPerson = await this.seriesPersonRepository.findOne(id);
    if (!seriesPerson) {
      throw new NotFoundError();
    }
    return seriesPerson;
  }

  async update(
    id: number,
    updateSeriesPersonInput: UpdateSeriesPersonInput,
  ): Promise<SeriesPersonModel> {
    const seriesPerson = await this.seriesPersonRepository.findOne(id);
    if (!seriesPerson) {
      throw new NotFoundError();
    }
    return this.seriesPersonRepository.save({
      ...seriesPerson,
      ...updateSeriesPersonInput,
    });
  }

  async delete(id: number): Promise<boolean> {
    const seriesPerson = await this.seriesPersonRepository.findOne(id);
    if (!seriesPerson) {
      throw new NotFoundError();
    }
    await this.seriesPersonRepository.remove(seriesPerson);
    return true;
  }
}
