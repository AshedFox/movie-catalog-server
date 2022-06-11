import { Injectable } from '@nestjs/common';
import { CreateFilmPersonInput } from './dto/create-film-person.input';
import { UpdateFilmPersonInput } from './dto/update-film-person.input';
import { PersonTypeEnum } from '../shared/person-type.enum';
import { SeriesPersonModel } from '../series-person/entities/series-person.model';
import { FilmPersonModel } from './entities/film-person.model';

@Injectable()
export class FilmPersonService {
  async create(createFilmPersonInput: CreateFilmPersonInput) {
    const filmPerson = await FilmPersonModel.create(createFilmPersonInput);
    return filmPerson.save();
  }

  async readAll(
    take: number,
    skip: number,
    filmId?: string,
    personId?: number,
    type?: PersonTypeEnum,
  ) {
    const [data, count] = await FilmPersonModel.findAndCount({
      where: [
        filmId ? { filmId } : {},
        personId ? { personId } : {},
        type ? { type } : {},
      ],
      take,
      skip,
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readOne(id: number) {
    return FilmPersonModel.findOne(id);
  }

  async update(id: number, updateFilmPersonInput: UpdateFilmPersonInput) {
    await FilmPersonModel.update(id, updateFilmPersonInput);
    return FilmPersonModel.findOne(id);
  }

  async delete(id: number) {
    return !!(await FilmPersonModel.delete(id));
  }
}
