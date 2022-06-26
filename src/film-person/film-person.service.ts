import { Injectable } from '@nestjs/common';
import { CreateFilmPersonInput } from './dto/create-film-person.input';
import { UpdateFilmPersonInput } from './dto/update-film-person.input';
import { PersonTypeEnum } from '../shared/person-type.enum';
import { FilmPersonModel } from './entities/film-person.model';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { FilmService } from '../film/film.service';
import { PersonService } from '../person/person.service';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';

@Injectable()
export class FilmPersonService {
  constructor(
    @InjectRepository(FilmPersonModel)
    private readonly filmPersonRepository: Repository<FilmPersonModel>,
    private readonly filmService: FilmService,
    private readonly personService: PersonService,
  ) {}

  async create(createFilmPersonInput: CreateFilmPersonInput) {
    await this.filmService.readOne(createFilmPersonInput.filmId);
    await this.personService.readOne(createFilmPersonInput.personId);
    const filmPerson = await this.filmPersonRepository.findOne({
      filmId: createFilmPersonInput.filmId,
      personId: createFilmPersonInput.personId,
    });
    if (filmPerson) {
      throw new AlreadyExistsError(
        `Person with id ${filmPerson.personId} already exists for film with id ${filmPerson.filmId}`,
      );
    }
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

  async readFilmsPersons(filmsIds: string[]): Promise<FilmPersonModel[]> {
    return await this.filmPersonRepository.find({
      where: { filmId: In(filmsIds) },
    });
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
