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
import { MovieTypeEnum } from '@utils/enums';

@Injectable()
export class SeriesService extends BaseService<
  SeriesEntity,
  Omit<CreateSeriesInput, 'cover'>,
  Omit<UpdateSeriesInput, 'cover'>
> {
  constructor(
    @InjectRepository(SeriesEntity)
    private readonly seriesRepository: Repository<SeriesEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(seriesRepository);
  }

  create = async (
    createSeriesInput: Omit<CreateSeriesInput, 'cover'>,
  ): Promise<SeriesEntity> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { genresIds, studiosIds, countriesIds } = createSeriesInput;
      const series = await queryRunner.manager.save(SeriesEntity, {
        ...createSeriesInput,
        type: MovieTypeEnum.Series,
      });

      if (countriesIds) {
        series.countriesConnection = await queryRunner.manager.save(
          MovieCountryEntity,
          countriesIds.map((countryId) => ({ movieId: series.id, countryId })),
        );
      }
      if (genresIds) {
        series.genresConnection = await queryRunner.manager.save(
          MovieGenreEntity,
          genresIds.map((genreId) => ({ movieId: series.id, genreId })),
        );
      }
      if (studiosIds) {
        series.studiosConnection = await queryRunner.manager.save(
          MovieStudioEntity,
          studiosIds.map((studioId) => ({ movieId: series.id, studioId })),
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
