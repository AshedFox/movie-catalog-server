import { Injectable } from '@nestjs/common';
import { CreateSeriesPersonInput } from './dto/create-series-person.input';
import { UpdateSeriesPersonInput } from './dto/update-series-person.input';
import { SeriesPersonModel } from './entities/series-person.model';
import { PersonTypeEnum } from '../shared/person-type.enum';
import { PaginatedSeriesPersons } from './dto/paginated-series-persons.result';

@Injectable()
export class SeriesPersonService {
  async create(createSeriesPersonInput: CreateSeriesPersonInput) {
    const seriesPerson = await SeriesPersonModel.create(
      createSeriesPersonInput,
    );
    return seriesPerson.save();
  }

  readOne(id: number): Promise<SeriesPersonModel> {
    return SeriesPersonModel.findOne(id);
  }

  async readAll(
    take: number,
    skip: number,
    seriesId?: string,
    personId?: number,
    type?: PersonTypeEnum,
  ): Promise<PaginatedSeriesPersons> {
    const [data, count] = await SeriesPersonModel.findAndCount({
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

  async update(id: number, updateSeriesPersonInput: UpdateSeriesPersonInput) {
    await SeriesPersonModel.update(id, updateSeriesPersonInput);
    return SeriesPersonModel.findOne(id);
  }

  async delete(id: number) {
    return !!(await SeriesPersonModel.delete(id));
  }
}
