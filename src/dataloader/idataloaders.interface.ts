import DataLoader from 'dataloader';
import { EmailConfirmationEntity } from '../email/entities/email-confirmation.entity';
import { SeriesEntity } from '../series/entities/series.entity';
import { FilmEntity } from '../film/entities/film.entity';
import { PersonEntity } from '../person/entities/person.entity';
import { SeasonEntity } from '../season/entities/season.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CountryEntity } from '../country/entities/country.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { MoviePersonEntity } from '../movie-person/entities/movie-person.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { EpisodeEntity } from '../episode/entities/episode.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { ImageEntity } from '../image/entities/image.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { MovieImageEntity } from '../movie-image/entities/movie-image.entity';
import { TrailerEntity } from '../trailer/entities/trailer.entity';
import { ReviewEntity } from '../review/entities/review.entity';

export interface IDataLoaders {
  countriesByStudioLoader: DataLoader<number, CountryEntity[]>;
  countryLoader: DataLoader<number, CountryEntity>;
  emailConfirmationLoader: DataLoader<string, EmailConfirmationEntity>;
  episodeLoader: DataLoader<string, EpisodeEntity>;
  episodesBySeasonLoader: DataLoader<string, EpisodeEntity[]>;
  episodesBySeriesLoader: DataLoader<string, EpisodeEntity[]>;
  filmLoader: DataLoader<string, FilmEntity>;
  genreLoader: DataLoader<string, GenreEntity>;
  genresByMovieLoader: DataLoader<string, GenreEntity[]>;
  imageLoader: DataLoader<string, ImageEntity>;
  movieImagesByMovieLoader: DataLoader<string, MovieImageEntity[]>;
  movieLoader: DataLoader<string, MovieEntity>;
  moviePersonsByMovieLoader: DataLoader<string, MoviePersonEntity[]>;
  personLoader: DataLoader<number, PersonEntity>;
  reviewLoader: DataLoader<number, ReviewEntity>;
  reviewsByMovieLoader: DataLoader<string, ReviewEntity[]>;
  reviewsByUserLoader: DataLoader<string, ReviewEntity[]>;
  seasonLoader: DataLoader<string, SeasonEntity>;
  seasonsBySeriesLoader: DataLoader<string, SeasonEntity[]>;
  seriesLoader: DataLoader<string, SeriesEntity>;
  studioLoader: DataLoader<number, StudioEntity>;
  studiosByMovieLoader: DataLoader<string, StudioEntity[]>;
  trailerLoader: DataLoader<number, TrailerEntity>;
  trailersByMovieLoader: DataLoader<string, TrailerEntity[]>;
  userLoader: DataLoader<string, UserEntity>;
  videoLoader: DataLoader<string, VideoEntity>;
}
