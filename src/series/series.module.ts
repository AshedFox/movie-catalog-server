import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { MovieCountryEntity } from '../movie-country/entities/movie-country.entity';
import { MovieGenreEntity } from '../movie-genre/entities/movie-genre.entity';
import { MovieStudioEntity } from '../movie-studio/entities/movie-studio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SeriesEntity,
      MovieCountryEntity,
      MovieGenreEntity,
      MovieStudioEntity,
    ]),
  ],
  providers: [SeriesResolver, SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
