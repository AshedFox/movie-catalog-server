import { Injectable } from '@nestjs/common';
import { FilmPersonService } from '../film-person/film-person.service';
import { IDataLoaders } from './idataloaders.interface';
import DataLoader from 'dataloader';
import { FilmPersonModel } from '../film-person/entities/film-person.model';
import { EmailConfirmationService } from '../email/email-confirmation.service';
import { EmailConfirmationModel } from '../email/entities/email-confirmation.model';
import { SeriesService } from '../series/series.service';
import { SeriesModel } from '../series/entities/series.model';
import { FilmService } from '../film/film.service';
import { PersonModel } from '../person/entities/person.model';
import { PersonService } from '../person/person.service';
import { SeasonService } from '../season/season.service';
import { SeasonModel } from '../season/entities/season.model';
import { UserModel } from '../user/entities/user.model';
import { UserService } from '../user/user.service';
import { FilmModel } from '../film/entities/film.model';
import { VideoModel } from '../video/entities/video.model';
import { VideoService } from '../video/video.service';
import { CountryService } from '../country/country.service';
import { CountryModel } from '../country/entities/country.model';
import { StudioCountryService } from '../studio-country/studio-country.service';
import { StudioService } from '../studio/studio.service';
import { StudioModel } from '../studio/entities/studio.model';
import { SeriesPersonService } from '../series-person/series-person.service';
import { SeriesPersonModel } from '../series-person/entities/series-person.model';
import { GenreModel } from '../genre/entities/genre.model';
import { GenreService } from '../genre/genre.service';
import { FilmGenreService } from '../film-genre/film-genre.service';
import { FilmStudioService } from '../film-studio/film-studio.service';
import { SeriesGenreService } from '../series-genre/series-genre.service';
import { SeriesStudioService } from '../series-studio/series-studio.service';
import { EpisodeModel } from '../episode/entities/episode.model';
import { EpisodeService } from '../episode/episode.service';
import { QualityModel } from '../quality/entities/quality.model';
import { QualityService } from '../quality/quality.service';
import { VideoQualityService } from '../video-quality/video-quality.service';

@Injectable()
export class DataLoaderService {
  constructor(
    private readonly countryService: CountryService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly episodeService: EpisodeService,
    private readonly filmService: FilmService,
    private readonly filmPersonService: FilmPersonService,
    private readonly filmGenreService: FilmGenreService,
    private readonly filmStudioService: FilmStudioService,
    private readonly genreService: GenreService,
    private readonly personService: PersonService,
    private readonly qualityService: QualityService,
    private readonly seasonService: SeasonService,
    private readonly seriesService: SeriesService,
    private readonly seriesPersonService: SeriesPersonService,
    private readonly seriesGenreService: SeriesGenreService,
    private readonly seriesStudioService: SeriesStudioService,
    private readonly studioService: StudioService,
    private readonly studioCountryService: StudioCountryService,
    private readonly userService: UserService,
    private readonly videoService: VideoService,
    private readonly videoQualityService: VideoQualityService,
  ) {}

  private mapSingleData<T extends { id: string | number }>(
    ids: (string | number)[],
    data: T[],
  ) {
    const dataAsObj = data.reduce((result, currentValue) => {
      result[currentValue.id] = currentValue;
      return result;
    }, {});
    return ids.map((id) => dataAsObj[id]);
  }

  createLoaders(): IDataLoaders {
    const countryLoader = new DataLoader<number, CountryModel>(
      async (ids: number[]) => {
        const data = await this.countryService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const countriesByStudioLoader = new DataLoader<number, CountryModel[]>(
      async (studiosIds: number[]) => {
        const studiosCountries =
          await this.studioCountryService.readStudiosCountries(studiosIds);
        const map: { [key: number]: CountryModel[] } = {};
        studiosCountries.forEach((studioCountry) => {
          if (map[studioCountry.studioId]) {
            map[studioCountry.studioId].push(studioCountry.country);
          } else {
            map[studioCountry.studioId] = [studioCountry.country];
          }
        });
        return studiosIds.map((studioId) => map[studioId] ?? []);
      },
    );
    const emailConfirmationLoader = new DataLoader<
      string,
      EmailConfirmationModel
    >(async (ids: string[]) => {
      const data = await this.emailConfirmationService.readAllByIds(ids);
      return this.mapSingleData(ids, data);
    });
    const filmLoader = new DataLoader<string, FilmModel>(
      async (ids: string[]) => {
        const data = await this.filmService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const episodesBySeriesLoader = new DataLoader<string, EpisodeModel[]>(
      async (seriesIds: string[]) => {
        const episodes = await this.episodeService.readManySeriesEpisodes(
          seriesIds,
        );
        const map: { [key: string]: EpisodeModel[] } = {};
        episodes.forEach((episode) => {
          if (map[episode.seriesId]) {
            map[episode.seriesId].push(episode);
          } else {
            map[episode.seriesId] = [episode];
          }
        });
        return seriesIds.map((seriesId) => map[seriesId] ?? []);
      },
    );
    const episodesBySeasonLoader = new DataLoader<string, EpisodeModel[]>(
      async (seasonsIds: string[]) => {
        const episodes = await this.episodeService.readSeasonsEpisodes(
          seasonsIds,
        );
        const map: { [key: string]: EpisodeModel[] } = {};
        episodes.forEach((episode) => {
          if (map[episode.seasonId]) {
            map[episode.seasonId].push(episode);
          } else {
            map[episode.seasonId] = [episode];
          }
        });
        return seasonsIds.map((seasonId) => map[seasonId] ?? []);
      },
    );
    const filmPersonsByFilmLoader = new DataLoader<string, FilmPersonModel[]>(
      async (filmsIds: string[]) => {
        const filmsPersons = await this.filmPersonService.readFilmsPersons(
          filmsIds,
        );
        const map: { [key: string]: FilmPersonModel[] } = {};
        filmsPersons.forEach((filmPerson) => {
          if (map[filmPerson.filmId]) {
            map[filmPerson.filmId].push(filmPerson);
          } else {
            map[filmPerson.filmId] = [filmPerson];
          }
        });
        return filmsIds.map((filmId) => map[filmId] ?? []);
      },
    );
    const genreLoader = new DataLoader<string, GenreModel>(
      async (ids: string[]) => {
        const data = await this.genreService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const genresByFilmLoader = new DataLoader<string, GenreModel[]>(
      async (filmsIds: string[]) => {
        const filmGenres = await this.filmGenreService.readFilmsGenres(
          filmsIds,
        );
        const map: { [key: string]: GenreModel[] } = {};
        filmGenres.forEach((filmGenre) => {
          if (map[filmGenre.filmId]) {
            map[filmGenre.filmId].push(filmGenre.genre);
          } else {
            map[filmGenre.filmId] = [filmGenre.genre];
          }
        });
        return filmsIds.map((genreId) => map[genreId] ?? []);
      },
    );
    const genresBySeriesLoader = new DataLoader<string, GenreModel[]>(
      async (seriesIds: string[]) => {
        const seriesGenres = await this.seriesGenreService.readManySeriesGenres(
          seriesIds,
        );
        const map: { [key: string]: GenreModel[] } = {};
        seriesGenres.forEach((seriesGenre) => {
          if (map[seriesGenre.seriesId]) {
            map[seriesGenre.seriesId].push(seriesGenre.genre);
          } else {
            map[seriesGenre.seriesId] = [seriesGenre.genre];
          }
        });
        return seriesIds.map((genreId) => map[genreId] ?? []);
      },
    );
    const seriesPersonsBySeriesLoader = new DataLoader<
      string,
      SeriesPersonModel[]
    >(async (seriesIds: string[]) => {
      const seriesPersons = await this.seriesPersonService.readSeriesPersons(
        seriesIds,
      );
      const map: { [key: string]: SeriesPersonModel[] } = {};
      seriesPersons.forEach((seriesPerson) => {
        if (map[seriesPerson.seriesId]) {
          map[seriesPerson.seriesId].push(seriesPerson);
        } else {
          map[seriesPerson.seriesId] = [seriesPerson];
        }
      });
      return seriesIds.map((studioId) => map[studioId] ?? []);
    });
    const personLoader = new DataLoader<number, PersonModel>(
      async (ids: number[]) => {
        const data = await this.personService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const qualityLoader = new DataLoader<number, QualityModel>(
      async (ids: number[]) => {
        const data = await this.qualityService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const qualitiesByVideoLoader = new DataLoader<string, QualityModel[]>(
      async (videosIds: string[]) => {
        const videosQualities =
          await this.videoQualityService.readVideosQualities(videosIds);
        const map: { [key: string]: QualityModel[] } = {};
        videosQualities.forEach((videoQuality) => {
          if (map[videoQuality.videoId]) {
            map[videoQuality.videoId].push(videoQuality.quality);
          } else {
            map[videoQuality.videoId] = [videoQuality.quality];
          }
        });
        return videosIds.map((videoId) => map[videoId] ?? []);
      },
    );
    const seasonLoader = new DataLoader<string, SeasonModel>(
      async (ids: string[]) => {
        const data = await this.seasonService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const seasonsBySeriesLoader = new DataLoader<string, SeasonModel[]>(
      async (seriesIds: string[]) => {
        const seasons = await this.seasonService.readSeasonsBySeries(seriesIds);
        const map: { [key: string]: SeasonModel[] } = {};
        seasons.forEach((season) => {
          if (map[season.seriesId]) {
            map[season.seriesId].push(season);
          } else {
            map[season.seriesId] = [season];
          }
        });
        return seriesIds.map((seasonId) => map[seasonId] ?? []);
      },
    );
    const seriesLoader = new DataLoader<string, SeriesModel>(
      async (ids: string[]) => {
        const data = await this.seriesService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const studioLoader = new DataLoader<number, StudioModel>(
      async (ids: number[]) => {
        const data = await this.studioService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const studiosByFilmLoader = new DataLoader<string, StudioModel[]>(
      async (filmsIds: string[]) => {
        const filmStudios = await this.filmStudioService.readFilmsStudios(
          filmsIds,
        );
        const map: { [key: string]: StudioModel[] } = {};
        filmStudios.forEach((filmStudio) => {
          if (map[filmStudio.filmId]) {
            map[filmStudio.filmId].push(filmStudio.studio);
          } else {
            map[filmStudio.filmId] = [filmStudio.studio];
          }
        });
        return filmsIds.map((studioId) => map[studioId] ?? []);
      },
    );
    const studiosBySeriesLoader = new DataLoader<string, StudioModel[]>(
      async (seriesIds: string[]) => {
        const seriesStudios =
          await this.seriesStudioService.readManySeriesStudios(seriesIds);
        const map: { [key: string]: StudioModel[] } = {};
        seriesStudios.forEach((seriesStudio) => {
          if (map[seriesStudio.seriesId]) {
            map[seriesStudio.seriesId].push(seriesStudio.studio);
          } else {
            map[seriesStudio.seriesId] = [seriesStudio.studio];
          }
        });
        return seriesIds.map((studioId) => map[studioId] ?? []);
      },
    );
    const userLoader = new DataLoader<string, UserModel>(
      async (ids: string[]) => {
        const data = await this.userService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );
    const videoLoader = new DataLoader<string, VideoModel>(
      async (ids: string[]) => {
        const data = await this.videoService.readAllByIds(ids);
        return this.mapSingleData(ids, data);
      },
    );

    return {
      countryLoader,
      countriesByStudioLoader,
      emailConfirmationLoader,
      episodesBySeriesLoader,
      episodesBySeasonLoader,
      filmLoader,
      filmPersonsByFilmLoader,
      genreLoader,
      genresByFilmLoader,
      genresBySeriesLoader,
      personLoader,
      qualityLoader,
      qualitiesByVideoLoader,
      seasonLoader,
      seasonsBySeriesLoader,
      seriesLoader,
      seriesPersonsBySeriesLoader,
      studioLoader,
      studiosByFilmLoader,
      studiosBySeriesLoader,
      userLoader,
      videoLoader,
    };
  }
}
