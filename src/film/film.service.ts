import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { FilmModel } from './entities/film.model';
import { ILike } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';

@Injectable()
export class FilmService {
  async create(createFilmInput: CreateFilmInput): Promise<FilmModel> {
    const film = await FilmModel.create(createFilmInput);
    return film.save();
  }

  async readAll(
    title: string,
    take: number,
    skip: number,
  ): Promise<PaginatedFilms> {
    const [data, count] = await FilmModel.findAndCount({
      where: [
        title
          ? {
              title: ILike(`%${title}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        publicationDate: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readOne(id: string): Promise<FilmModel> {
    return FilmModel.findOne(id);
  }

  async update(
    id: string,
    updateFilmInput: UpdateFilmInput,
  ): Promise<FilmModel> {
    await FilmModel.update(id, updateFilmInput);
    return FilmModel.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await FilmModel.delete(id));
  }
}
