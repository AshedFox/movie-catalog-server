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

@Injectable()
export class FilmService extends BaseService<
  FilmEntity,
  CreateFilmInput,
  UpdateFilmInput
> {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(MovieCountryEntity)
    private readonly movieCountryRepository: Repository<MovieCountryEntity>,
    @InjectRepository(MovieStudioEntity)
    private readonly movieStudioRepository: Repository<MovieStudioEntity>,
    @InjectRepository(MovieGenreEntity)
    private readonly movieGenreRepository: Repository<MovieGenreEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(filmRepository);
  }

  create = async (createFilmInput: CreateFilmInput): Promise<FilmEntity> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const film = await this.filmRepository.save(
        {
          ...createFilmInput,
        },
        { transaction: false },
      );
      const { genresIds, studiosIds, countriesIds } = createFilmInput;

      if (countriesIds) {
        film.countriesConnection = await this.movieCountryRepository.save(
          countriesIds.map((countryId) => ({ movieId: film.id, countryId })),
          { transaction: false },
        );
      }
      if (genresIds) {
        film.genresConnection = await this.movieGenreRepository.save(
          genresIds.map((genreId) => ({ movieId: film.id, genreId })),
          { transaction: false },
        );
      }
      if (studiosIds) {
        film.studiosConnection = await this.movieStudioRepository.save(
          studiosIds.map((studioId) => ({
            movieId: film.id,
            genreId: studioId,
          })),
          { transaction: false },
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
