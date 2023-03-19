import DataLoader from 'dataloader';
import { EmailConfirmationEntity } from '../email/entities/email-confirmation.entity';
import { SeriesEntity } from '../series/entities/series.entity';
import { PersonEntity } from '../person/entities/person.entity';
import { SeasonEntity } from '../season/entities/season.entity';
import { MoviePersonTypeEntity } from '../movie-person-type/entities/movie-person-type.entity';
import { MovieImageTypeEntity } from '../movie-image-type/entities/movie-image-type.entity';
import { MediaEntity } from '../media/entities/media.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CountryEntity } from '../country/entities/country.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { MoviePersonEntity } from '../movie-person/entities/movie-person.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { CollectionEntity } from '../collection/entities/collection.entity';
import { EpisodeEntity } from '../episode/entities/episode.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { MovieImageEntity } from '../movie-image/entities/movie-image.entity';
import { TrailerEntity } from '../trailer/entities/trailer.entity';
import { MovieReviewEntity } from '../movie-review/entities/movie-review.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { RoomEntity } from '../room/entities/room.entity';
import { LanguageEntity } from '../language/entities/language.entity';
import { VideoVariantEntity } from '../video-variant/entities/video-variant.entity';

export interface IDataLoaders {
  collectionLoader: DataLoader<number, CollectionEntity>;
  countriesByMovieLoader: DataLoader<string, CountryEntity[]>;
  countriesByStudioLoader: DataLoader<number, CountryEntity[]>;
  countryLoader: DataLoader<string, CountryEntity>;
  currencyLoader: DataLoader<number, CurrencyEntity>;
  emailConfirmationLoader: DataLoader<string, EmailConfirmationEntity>;
  episodeLoader: DataLoader<string, EpisodeEntity>;
  episodesBySeasonLoader: DataLoader<string, EpisodeEntity[]>;
  episodesBySeriesLoader: DataLoader<string, EpisodeEntity[]>;
  genreLoader: DataLoader<string, GenreEntity>;
  genresByMovieLoader: DataLoader<string, GenreEntity[]>;
  languageLoader: DataLoader<string, LanguageEntity>;
  mediaLoader: DataLoader<number, MediaEntity>;
  movieImagesByMovieLoader: DataLoader<string, MovieImageEntity[]>;
  movieLoader: DataLoader<string, MovieEntity>;
  moviePersonTypeLoader: DataLoader<number, MoviePersonTypeEntity>;
  moviePersonsByMovieLoader: DataLoader<string, MoviePersonEntity[]>;
  movieReviewLoader: DataLoader<number, MovieReviewEntity>;
  movieReviewsByMovieLoader: DataLoader<string, MovieReviewEntity[]>;
  movieReviewsByUserLoader: DataLoader<string, MovieReviewEntity[]>;
  moviesByCollectionLoader: DataLoader<number, MovieEntity[]>;
  movieImageTypeLoader: DataLoader<number, MovieImageTypeEntity>;
  personLoader: DataLoader<number, PersonEntity>;
  roomLoader: DataLoader<string, RoomEntity>;
  seasonLoader: DataLoader<string, SeasonEntity>;
  seasonsBySeriesLoader: DataLoader<string, SeasonEntity[]>;
  seriesLoader: DataLoader<string, SeriesEntity>;
  studioLoader: DataLoader<number, StudioEntity>;
  studiosByMovieLoader: DataLoader<string, StudioEntity[]>;
  trailerLoader: DataLoader<number, TrailerEntity>;
  trailersByMovieLoader: DataLoader<string, TrailerEntity[]>;
  userLoader: DataLoader<string, UserEntity>;
  usersByRoomLoader: DataLoader<string, UserEntity[]>;
  videosByRoomLoader: DataLoader<string, VideoEntity[]>;
  videoLoader: DataLoader<number, VideoEntity>;
  videoVariantsByVideoLoader: DataLoader<number, VideoVariantEntity[]>;
}
