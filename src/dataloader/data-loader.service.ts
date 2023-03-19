import { Injectable } from '@nestjs/common';
import { MoviePersonService } from '../movie-person/movie-person.service';
import { IDataLoaders } from './idataloaders.interface';
import DataLoader from 'dataloader';
import { EmailConfirmationService } from '../email/services/email-confirmation.service';
import { SeriesService } from '../series/series.service';
import { FilmService } from '../film/film.service';
import { PersonService } from '../person/person.service';
import { SeasonService } from '../season/season.service';
import { UserService } from '../user/user.service';
import { CountryService } from '../country/country.service';
import { StudioCountryService } from '../studio-country/studio-country.service';
import { StudioService } from '../studio/studio.service';
import { GenreService } from '../genre/genre.service';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import { MovieStudioService } from '../movie-studio/movie-studio.service';
import { EpisodeService } from '../episode/episode.service';
import { MovieImageService } from '../movie-image/movie-image.service';
import { MovieCountryService } from '../movie-country/movie-country.service';
import { MovieService } from '../movie/movie.service';
import { MovieReviewService } from '../movie-review/movie-review.service';
import { TrailerService } from '../trailer/trailer.service';
import { IndexType } from 'src/utils/types/index.type';
import { CollectionService } from '../collection/collection.service';
import { CollectionMovieService } from '../collection-movie/collection-movie.service';
import { CurrencyService } from '../currency/currency.service';
import { RoomParticipantService } from '../room-participant/room-participant.service';
import { RoomService } from '../room/room.service';
import { MoviePersonTypeService } from '../movie-person-type/movie-person-type.service';
import { MovieImageTypeService } from '../movie-image-type/movie-image-type.service';
import { MediaService } from '../media/media.service';
import { VideoService } from '../video/video.service';
import { RoomVideoService } from '../room-video/room-video.service';
import { LanguageService } from '../language/language.service';
import { VideoVariantService } from '../video-variant/video-variant.service';
import { SubtitlesService } from '../subtitles/subtitles.service';

@Injectable()
export class DataLoaderService {
  constructor(
    private readonly collectionMovieService: CollectionMovieService,
    private readonly collectionService: CollectionService,
    private readonly countryService: CountryService,
    private readonly currencyService: CurrencyService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly episodeService: EpisodeService,
    private readonly filmService: FilmService,
    private readonly genreService: GenreService,
    private readonly languageService: LanguageService,
    private readonly mediaService: MediaService,
    private readonly movieCountryService: MovieCountryService,
    private readonly movieGenreService: MovieGenreService,
    private readonly movieImageService: MovieImageService,
    private readonly moviePersonService: MoviePersonService,
    private readonly movieReviewService: MovieReviewService,
    private readonly movieService: MovieService,
    private readonly movieStudioService: MovieStudioService,
    private readonly moviePersonTypeService: MoviePersonTypeService,
    private readonly movieImageTypeService: MovieImageTypeService,
    private readonly personService: PersonService,
    private readonly roomParticipantService: RoomParticipantService,
    private readonly roomService: RoomService,
    private readonly roomVideoService: RoomVideoService,
    private readonly seasonService: SeasonService,
    private readonly seriesService: SeriesService,
    private readonly studioCountryService: StudioCountryService,
    private readonly studioService: StudioService,
    private readonly subtitlesService: SubtitlesService,
    private readonly trailerService: TrailerService,
    private readonly userService: UserService,
    private readonly videoService: VideoService,
    private readonly videoVariantService: VideoVariantService,
  ) {}

  private mapSingleData = <I extends IndexType, D>(
    ids: I[],
    data: D[],
  ): D[] => {
    const map: { [key: IndexType]: D } = {};
    data.forEach((value) => {
      map[value['id']] = value;
    });
    return ids.map((id) => map[id] ?? null);
  };

  private mapMultipleData = <I extends IndexType, D>(
    ids: I[],
    data: D[],
    keyFieldName: keyof D,
  ): D[][] => {
    const map: { [key: IndexType]: D[] } = {};
    data.forEach((value) => {
      if (map[value[keyFieldName as string]]) {
        map[value[keyFieldName as string]].push(value);
      } else {
        map[value[keyFieldName as string]] = [value];
      }
    });
    return ids.map((id) => map[id] ?? []);
  };

  private mapMultipleDataConcrete = <I extends IndexType, D, R>(
    ids: I[],
    data: D[],
    keyFieldName: keyof D,
    relationFieldName: keyof D,
  ): R[][] => {
    const map: { [key: IndexType]: R[] } = {};
    data.forEach((value) => {
      if (map[value[keyFieldName as string]]) {
        map[value[keyFieldName as string]].push(
          value[relationFieldName as string],
        );
      } else {
        map[value[keyFieldName as string]] = [
          value[relationFieldName as string],
        ];
      }
    });
    return ids.map((id) => map[id] ?? []);
  };

  private createSingleLoader = <I extends IndexType, D>(
    readFn: (ids: I[]) => Promise<D[]>,
  ) => {
    return new DataLoader<I, D>(async (ids: I[]) =>
      this.mapSingleData(ids, await readFn(ids)),
    );
  };

  private createMultipleLoader = <I extends IndexType, D>(
    readByIdsFn: (ids: I[]) => Promise<D[]>,
    keyFieldName: keyof D,
  ) => {
    return new DataLoader<I, D[]>(async (ids: I[]) =>
      this.mapMultipleData(ids, await readByIdsFn(ids), keyFieldName),
    );
  };

  private createMultipleRelationLoader = <I extends IndexType, D, R>(
    readByIdsFn: (ids: I[]) => Promise<D[]>,
    keyFieldName: keyof D,
    relationFieldName: keyof D,
  ) => {
    return new DataLoader<I, R[]>(async (ids: I[]) =>
      this.mapMultipleDataConcrete<I, D, R>(
        ids,
        await readByIdsFn(ids),
        keyFieldName,
        relationFieldName,
      ),
    );
  };

  createLoaders = (): IDataLoaders => ({
    collectionLoader: this.createSingleLoader(
      this.collectionService.readManyByIds,
    ),
    countriesByStudioLoader: this.createMultipleRelationLoader(
      this.studioCountryService.readManyByStudios,
      'studioId',
      'country',
    ),
    countriesByMovieLoader: this.createMultipleRelationLoader(
      this.movieCountryService.readManyByMovies,
      'movieId',
      'country',
    ),
    countryLoader: this.createSingleLoader(this.countryService.readManyByIds),
    currencyLoader: this.createSingleLoader(this.currencyService.readManyByIds),
    emailConfirmationLoader: this.createSingleLoader(
      this.emailConfirmationService.readManyByIds,
    ),
    episodeLoader: this.createSingleLoader(this.episodeService.readManyByIds),
    episodesBySeasonLoader: this.createMultipleLoader(
      this.episodeService.readManyBySeasons,
      'seasonId',
    ),
    episodesBySeriesLoader: this.createMultipleLoader(
      this.episodeService.readManyBySeries,
      'seriesId',
    ),
    genreLoader: this.createSingleLoader(this.genreService.readManyByIds),
    genresByMovieLoader: this.createMultipleRelationLoader(
      this.movieGenreService.readManyByMovies,
      'movieId',
      'genre',
    ),
    languageLoader: this.createSingleLoader(this.languageService.readManyByIds),
    mediaLoader: this.createSingleLoader(this.mediaService.readManyByIds),
    moviesByCollectionLoader: this.createMultipleRelationLoader(
      this.collectionMovieService.readManyByCollections,
      'collectionId',
      'movie',
    ),
    movieImagesByMovieLoader: this.createMultipleLoader(
      this.movieImageService.readManyByMovies,
      'movieId',
    ),
    movieImageTypeLoader: this.createSingleLoader(
      this.movieImageTypeService.readManyByIds,
    ),
    moviePersonTypeLoader: this.createSingleLoader(
      this.moviePersonTypeService.readManyByIds,
    ),
    movieLoader: this.createSingleLoader(this.movieService.readManyByIds),
    moviePersonsByMovieLoader: this.createMultipleLoader(
      this.moviePersonService.readManyByMovies,
      'movieId',
    ),
    movieReviewLoader: this.createSingleLoader(
      this.movieReviewService.readManyByIds,
    ),
    movieReviewsByMovieLoader: this.createMultipleLoader(
      this.movieReviewService.readManyByMovies,
      'movieId',
    ),
    movieReviewsByUserLoader: this.createMultipleLoader(
      this.movieReviewService.readManyByUsers,
      'userId',
    ),
    personLoader: this.createSingleLoader(this.personService.readManyByIds),
    roomLoader: this.createSingleLoader(this.roomService.readManyByIds),
    seasonLoader: this.createSingleLoader(this.seasonService.readManyByIds),
    seasonsBySeriesLoader: this.createMultipleLoader(
      this.seasonService.readManyBySeries,
      'seriesId',
    ),
    seriesLoader: this.createSingleLoader(this.seriesService.readManyByIds),
    studioLoader: this.createSingleLoader(this.studioService.readManyByIds),
    studiosByMovieLoader: this.createMultipleRelationLoader(
      this.movieStudioService.readManyByMovies,
      'movieId',
      'studio',
    ),
    subtitlesLoader: this.createSingleLoader(
      this.subtitlesService.readManyByIds,
    ),
    subtitlesByVideoLoader: this.createMultipleLoader(
      this.subtitlesService.readManyByVideos,
      'videoId',
    ),
    trailerLoader: this.createSingleLoader(this.trailerService.readManyByIds),
    trailersByMovieLoader: this.createMultipleLoader(
      this.trailerService.readManyByMovies,
      'movieId',
    ),
    userLoader: this.createSingleLoader(this.userService.readManyByIds),
    usersByRoomLoader: this.createMultipleRelationLoader(
      this.roomParticipantService.readManyByRooms,
      'roomId',
      'user',
    ),
    videosByRoomLoader: this.createMultipleRelationLoader(
      this.roomVideoService.readManyByRooms,
      'roomId',
      'video',
    ),
    videoLoader: this.createSingleLoader(this.videoService.readManyByIds),
    videoVariantsByVideoLoader: this.createMultipleLoader(
      this.videoVariantService.readManyByVideos,
      'videoId',
    ),
  });
}
