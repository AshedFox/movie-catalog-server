import { Global, Module } from '@nestjs/common';
import { DataLoaderService } from './data-loader.service';
import { FilmPersonModule } from '../film-person/film-person.module';
import { SeriesModule } from '../series/series.module';
import { EmailModule } from '../email/email.module';
import { FilmModule } from '../film/film.module';
import { PersonModule } from '../person/person.module';
import { SeasonModule } from '../season/season.module';
import { UserModule } from '../user/user.module';
import { CountryModule } from '../country/country.module';
import { StudioCountryModule } from '../studio-country/studio-country.module';
import { StudioModule } from '../studio/studio.module';
import { SeriesPersonModule } from '../series-person/series-person.module';
import { GenreModule } from '../genre/genre.module';
import { FilmGenreModule } from '../film-genre/film-genre.module';
import { FilmStudioModule } from '../film-studio/film-studio.module';
import { SeriesGenreModule } from '../series-genre/series-genre.module';
import { SeriesStudioModule } from '../series-studio/series-studio.module';
import { EpisodeModule } from '../episode/episode.module';
import { VideoModule } from '../video/video.module';
import { ImageModule } from '../image/image.module';
import { EpisodePosterModule } from '../episode-poster/episode-poster.module';
import { FilmPosterModule } from '../film-poster/film-poster.module';
import { SeasonPosterModule } from '../season-poster/season-poster.module';
import { SeriesPosterModule } from '../series-poster/series-poster.module';

@Global()
@Module({
  imports: [
    CountryModule,
    EmailModule,
    EpisodeModule,
    EpisodePosterModule,
    FilmModule,
    FilmPosterModule,
    FilmPersonModule,
    FilmGenreModule,
    FilmStudioModule,
    ImageModule,
    GenreModule,
    PersonModule,
    SeasonModule,
    SeasonPosterModule,
    StudioModule,
    StudioCountryModule,
    SeriesModule,
    SeriesPosterModule,
    SeriesPersonModule,
    SeriesGenreModule,
    SeriesStudioModule,
    UserModule,
    VideoModule,
  ],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
