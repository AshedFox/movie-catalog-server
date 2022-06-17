import { Injectable } from '@nestjs/common';
import { CreateFilmPersonInput } from './dto/create-film-person.input';
import { UpdateFilmPersonInput } from './dto/update-film-person.input';
import { PersonTypeEnum } from '../shared/person-type.enum';
import { FilmPersonModel } from './entities/film-person.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class FilmPersonService {
  constructor(
    @InjectRepository(FilmPersonModel)
    private readonly filmPersonRepository: Repository<FilmPersonModel>,
  ) {}

  async create(createFilmPersonInput: CreateFilmPersonInput) {
    return this.filmPersonRepository.save(createFilmPersonInput);
  }

  async readAll(
    take: number,
    skip: number,
    filmId?: string,
    personId?: number,
    type?: PersonTypeEnum,
  ) {
    const [data, count] = await this.filmPersonRepository.findAndCount({
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

  async readAllByIds(ids: number[]): Promise<FilmPersonModel[]> {
    return await this.filmPersonRepository.findByIds(ids);
  }

  async readOne(id: number): Promise<FilmPersonModel> {
    const filmPerson = await this.filmPersonRepository.findOne(id);
    if (!filmPerson) {
      throw new NotFoundError();
    }
    return filmPerson;
  }

  async update(
    id: number,
    updateFilmPersonInput: UpdateFilmPersonInput,
  ): Promise<FilmPersonModel> {
    const filmPerson = await this.filmPersonRepository.findOne(id);
    if (!filmPerson) {
      throw new NotFoundError();
    }
    return this.filmPersonRepository.save({
      ...filmPerson,
      ...updateFilmPersonInput,
    });
  }

  async delete(id: number): Promise<boolean> {
    const filmPerson = await this.filmPersonRepository.findOne(id);
    if (!filmPerson) {
      throw new NotFoundError();
    }
    await this.filmPersonRepository.remove(filmPerson);
    return true;
  }
}
