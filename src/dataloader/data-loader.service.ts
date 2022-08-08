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
import { VideoService } from '../video/video.service';
import { ImageService } from '../image/image.service';
import { MovieImageService } from '../movie-image/movie-image.service';
import { MovieService } from '../movie/movie.service';
import { ReviewService } from '../review/review.service';
import { TrailerService } from '../trailer/trailer.service';
import { IndexType } from 'src/utils/types/index.type';

@Injectable()
export class DataLoaderService {
  constructor(
    private readonly countryService: CountryService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly episodeService: EpisodeService,
    private readonly filmService: FilmService,
    private readonly genreService: GenreService,
    private readonly imageService: ImageService,
    private readonly movieGenreService: MovieGenreService,
    private readonly movieImageService: MovieImageService,
    private readonly moviePersonService: MoviePersonService,
    private readonly movieService: MovieService,
    private readonly movieStudioService: MovieStudioService,
    private readonly personService: PersonService,
    private readonly reviewService: ReviewService,
    private readonly seasonService: SeasonService,
    private readonly seriesService: SeriesService,
    private readonly studioCountryService: StudioCountryService,
    private readonly studioService: StudioService,
    private readonly trailerService: TrailerService,
    private readonly userService: UserService,
    private readonly videoService: VideoService,
  ) {}

  private mapSingleData = <I extends IndexType, D extends { id: I }>(
    ids: I[],
    data: D[],
  ): D[] => {
    const map: { [key: IndexType]: D } = {};
    data.forEach((value) => {
      map[value.id] = value;
    });
    return ids.map((id) => map[id] ?? null);
  };

  private mapMultipleData = <I extends IndexType, D extends object>(
    ids: I[],
    data: D[],
    keyFieldName: IndexType,
  ): D[][] => {
    const map: { [key: IndexType]: D[] } = {};
    data.forEach((value) => {
      if (map[value[keyFieldName]]) {
        map[value[keyFieldName]].push(value);
      } else {
        map[value[keyFieldName]] = [value];
      }
    });
    return ids.map((id) => map[id] ?? []);
  };

  private mapMultipleDataConcrete = <
    I extends IndexType,
    D extends object,
    R extends object,
  >(
    ids: I[],
    data: D[],
    keyFieldName: IndexType,
    relationFieldName: IndexType,
  ): R[][] => {
    const map: { [key: IndexType]: R[] } = {};
    data.forEach((value) => {
      if (map[value[keyFieldName]]) {
        map[value[keyFieldName]].push(value[relationFieldName]);
      } else {
        map[value[keyFieldName]] = [value[relationFieldName]];
      }
    });
    return ids.map((id) => map[id] ?? []);
  };

  private createSingleLoader = <I extends IndexType, D extends { id: I }>(
    readByIdsMethod: (ids: I[]) => Promise<D[]>,
  ) => {
    return new DataLoader<I, D>(async (ids: I[]) =>
      this.mapSingleData(ids, await readByIdsMethod(ids)),
    );
  };

  private createMultipleLoader = <I extends IndexType, D extends object>(
    readByIdsMethod: (ids: I[]) => Promise<D[]>,
    keyFieldName: keyof D,
  ) => {
    return new DataLoader<I, D[]>(async (ids: I[]) =>
      this.mapMultipleData(ids, await readByIdsMethod(ids), keyFieldName),
    );
  };

  private createMultipleRelationLoader = <
    I extends IndexType,
    D extends object,
    R extends object,
  >(
    readByIdsMethod: (ids: I[]) => Promise<D[]>,
    keyFieldName: keyof D,
    relationFieldName: keyof D,
  ) => {
    return new DataLoader<I, R[]>(async (ids: I[]) =>
      this.mapMultipleDataConcrete<I, D, R>(
        ids,
        await readByIdsMethod(ids),
        keyFieldName,
        relationFieldName,
      ),
    );
  };

  createLoaders = (): IDataLoaders => ({
    countriesByStudioLoader: this.createMultipleRelationLoader(
      this.studioCountryService.readManyByStudios,
      'studioId',
      'country',
    ),
    countryLoader: this.createSingleLoader(this.countryService.readManyByIds),
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
    filmLoader: this.createSingleLoader(this.filmService.readManyByIds),
    genreLoader: this.createSingleLoader(this.genreService.readManyByIds),
    genresByMovieLoader: this.createMultipleRelationLoader(
      this.movieGenreService.readManyByMovies,
      'movieId',
      'genre',
    ),
    imageLoader: this.createSingleLoader(this.imageService.readManyByIds),
    movieImagesByMovieLoader: this.createMultipleLoader(
      this.movieImageService.readManyByMovies,
      'movieId',
    ),
    movieLoader: this.createSingleLoader(this.movieService.readManyByIds),
    moviePersonsByMovieLoader: this.createMultipleLoader(
      this.moviePersonService.readManyByMovies,
      'movieId',
    ),
    personLoader: this.createSingleLoader(this.personService.readManyByIds),
    reviewLoader: this.createSingleLoader(this.reviewService.readManyByIds),
    reviewsByMovieLoader: this.createMultipleLoader(
      this.reviewService.readManyByMovies,
      'movieId',
    ),
    reviewsByUserLoader: this.createMultipleLoader(
      this.reviewService.readManyByUsers,
      'userId',
    ),
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
    trailerLoader: this.createSingleLoader(this.trailerService.readManyByIds),
    trailersByMovieLoader: this.createMultipleLoader(
      this.trailerService.readManyByMovies,
      'movieId',
    ),
    userLoader: this.createSingleLoader(this.userService.readManyByIds),
    videoLoader: this.createSingleLoader(this.videoService.readManyByIds),
  });
}
