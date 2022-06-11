import { Injectable } from '@nestjs/common';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreModel } from './entities/genre.model';
import { ILike } from 'typeorm';
import { PaginatedGenres } from './dto/paginated-genres.result';

@Injectable()
export class GenreService {
  async create(createGenreInput: CreateGenreInput): Promise<GenreModel> {
    const genre = await GenreModel.create(createGenreInput);
    return genre.save();
  }

  async readAll(
    name: string,
    take: number,
    skip: number,
  ): Promise<PaginatedGenres> {
    const [data, count] = await GenreModel.findAndCount({
      where: [
        name
          ? {
              name: ILike(`%${name}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readOne(id: string): Promise<GenreModel> {
    return GenreModel.findOne(id);
  }

  async update(
    id: string,
    updateGenreInput: UpdateGenreInput,
  ): Promise<GenreModel> {
    await GenreModel.update(id, updateGenreInput);
    return GenreModel.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await GenreModel.delete(id));
  }
}
