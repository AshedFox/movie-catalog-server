import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { DataSource, Repository } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilmEntity } from './entities/film.entity';
import { MovieCountryEntity } from '../movie-country/entities/movie-country.entity';
import { MovieStudioEntity } from '../movie-studio/entities/movie-studio.entity';
import { MovieGenreEntity } from '../movie-genre/entities/movie-genre.entity';
import { BaseService } from '@common/services/base.service';
import { MovieTypeEnum } from '@utils/enums';

@Injectable()
export class FilmService extends BaseService<
  FilmEntity,
  Omit<CreateFilmInput, 'cover'>,
  Omit<UpdateFilmInput, 'cover'>
> {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(filmRepository);
  }

  create = async (
    createFilmInput: Omit<CreateFilmInput, 'cover'>,
  ): Promise<FilmEntity> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const film = await queryRunner.manager.save(FilmEntity, {
        ...createFilmInput,
        type: MovieTypeEnum.Film,
      });
      const { genresIds, studiosIds, countriesIds } = createFilmInput;

      if (countriesIds) {
        film.countriesConnection = await queryRunner.manager.save(
          MovieCountryEntity,
          countriesIds.map((countryId) => ({ movieId: film.id, countryId })),
        );
      }
      if (genresIds) {
        film.genresConnection = await queryRunner.manager.save(
          MovieGenreEntity,
          genresIds.map((genreId) => ({ movieId: film.id, genreId })),
        );
      }
      if (studiosIds) {
        film.studiosConnection = await queryRunner.manager.save(
          MovieStudioEntity,
          studiosIds.map((studioId) => ({
            movieId: film.id,
            genreId: studioId,
          })),
        );
      }
      await queryRunner.commitTransaction();
      return film;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}
