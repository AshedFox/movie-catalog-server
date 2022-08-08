import { Injectable } from '@nestjs/common';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreEntity } from './entities/genre.entity';
import { ILike, In, Repository } from 'typeorm';
import { PaginatedGenres } from './dto/paginated-genres';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  create = async (createGenreInput: CreateGenreInput): Promise<GenreEntity> =>
    this.genreRepository.save(createGenreInput);

  readMany = async (
    take: number,
    skip: number,
    name?: string,
  ): Promise<PaginatedGenres> => {
    const [data, count] = await this.genreRepository.findAndCount({
      where: {
        name: name ? ILike(`%${name}%`) : undefined,
      },
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count > take + skip };
  };

  readManyByIds = async (ids: string[]): Promise<GenreEntity[]> =>
    await this.genreRepository.findBy({ id: In(ids) });

  async readOne(id: string): Promise<GenreEntity> {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundError(`Genre with id "${id}" not found!`);
    }
    return genre;
  }

  update = async (
    id: string,
    updateGenreInput: UpdateGenreInput,
  ): Promise<GenreEntity> => {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundError(`Genre with id "${id}" not found!`);
    }
    return this.genreRepository.save({
      ...genre,
      ...updateGenreInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundError(`Genre with id "${id}" not found!`);
    }
    await this.genreRepository.remove(genre);
    return true;
  };
}
