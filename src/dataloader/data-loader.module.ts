import { Global, Module } from '@nestjs/common';
import { DataLoaderService } from './data-loader.service';
import { MoviePersonModule } from '../movie-person/movie-person.module';
import { SeriesModule } from '../series/series.module';
import { EmailModule } from '../email/email.module';
import { FilmModule } from '../film/film.module';
import { PersonModule } from '../person/person.module';
import { SeasonModule } from '../season/season.module';
import { UserModule } from '../user/user.module';
import { CountryModule } from '../country/country.module';
import { StudioCountryModule } from '../studio-country/studio-country.module';
import { StudioModule } from '../studio/studio.module';
import { GenreModule } from '../genre/genre.module';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
import { MovieStudioModule } from '../movie-studio/movie-studio.module';
import { EpisodeModule } from '../episode/episode.module';
import { VideoModule } from '../video/video.module';
import { ImageModule } from '../image/image.module';
import { MovieImageModule } from '../movie-image/movie-image.module';
import { MovieModule } from '../movie/movie.module';
import { MovieCountryModule } from '../movie-country/movie-country.module';
import { ReviewModule } from '../review/review.module';
import { TrailerModule } from '../trailer/trailer.module';

@Global()
@Module({
  imports: [
    CountryModule,
    EmailModule,
    EpisodeModule,
    FilmModule,
    GenreModule,
    ImageModule,
    MovieGenreModule,
    MovieImageModule,
    MovieModule,
    MovieCountryModule,
    MoviePersonModule,
    MovieStudioModule,
    PersonModule,
    ReviewModule,
    SeasonModule,
    SeriesModule,
    StudioCountryModule,
    StudioModule,
    TrailerModule,
    UserModule,
    VideoModule,
  ],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
