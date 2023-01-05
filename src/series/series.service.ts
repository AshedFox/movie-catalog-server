import { Injectable } from '@nestjs/common';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { MovieCountryEntity } from '../movie-country/entities/movie-country.entity';
import { MovieStudioEntity } from '../movie-studio/entities/movie-studio.entity';
import { MovieGenreEntity } from '../movie-genre/entities/movie-genre.entity';
import { BaseService } from '@common/services/base.service';

@Injectable()
export class SeriesService extends BaseService<
  SeriesEntity,
  CreateSeriesInput,
  UpdateSeriesInput
> {
  constructor(
    @InjectRepository(SeriesEntity)
    private readonly seriesRepository: Repository<SeriesEntity>,
    @InjectRepository(MovieCountryEntity)
    private readonly movieCountryRepository: Repository<MovieCountryEntity>,
    @InjectRepository(MovieStudioEntity)
    private readonly movieStudioRepository: Repository<MovieStudioEntity>,
    @InjectRepository(MovieGenreEntity)
    private readonly movieGenreRepository: Repository<MovieGenreEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(seriesRepository);
  }

  create = async (
    createSeriesInput: CreateSeriesInput,
  ): Promise<SeriesEntity> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const { genresIds, studiosIds, countriesIds } = createSeriesInput;
      const series = await this.seriesRepository.save(
        {
          ...createSeriesInput,
        },
        { transaction: false },
      );

      if (countriesIds) {
        series.countriesConnection = await this.movieCountryRepository.save(
          countriesIds.map((countryId) => ({ movieId: series.id, countryId })),
          { transaction: false },
        );
      }
      if (genresIds) {
        series.genresConnection = await this.movieGenreRepository.save(
          genresIds.map((genreId) => ({ movieId: series.id, genreId })),
          { transaction: false },
        );
      }
      if (studiosIds) {
        series.studiosConnection = await this.movieStudioRepository.save(
          studiosIds.map((studioId) => ({
            movieId: series.id,
            genreId: studioId,
          })),
          { transaction: false },
        );
      }
      await queryRunner.commitTransaction();
      return series;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };
}
