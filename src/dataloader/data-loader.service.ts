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

@Injectable()
export class DataLoaderService {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly filmService: FilmService,
    private readonly filmPersonService: FilmPersonService,
    private readonly personService: PersonService,
    private readonly seasonService: SeasonService,
    private readonly seriesService: SeriesService,
    private readonly userService: UserService,
  ) {}

  createLoaders(): IDataLoaders {
    const emailConfirmationLoader = new DataLoader<
      string,
      EmailConfirmationModel
    >(async (ids: string[]) => this.emailConfirmationService.readAllByIds(ids));
    const filmLoader = new DataLoader<string, FilmModel>(
      async (ids: string[]) => this.filmService.readAllByIds(ids),
    );
    const filmPersonLoader = new DataLoader<number, FilmPersonModel>(
      async (ids: number[]) => this.filmPersonService.readAllByIds(ids),
    );
    const personLoader = new DataLoader<number, PersonModel>(
      async (ids: number[]) => this.personService.readAllByIds(ids),
    );
    const seasonLoader = new DataLoader<string, SeasonModel>(
      async (ids: string[]) => this.seasonService.readAllByIds(ids),
    );
    const seriesLoader = new DataLoader<string, SeriesModel>(
      async (ids: string[]) => this.seriesService.readAllByIds(ids),
    );
    const userLoader = new DataLoader<string, UserModel>(
      async (ids: string[]) => this.userService.readAllByIds(ids),
    );

    return {
      emailConfirmationLoader,
      filmLoader,
      filmPersonLoader,
      personLoader,
      seasonLoader,
      seriesLoader,
      userLoader,
    };
  }
}
