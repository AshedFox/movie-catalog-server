import DataLoader from 'dataloader';
import { FilmPersonModel } from '../film-person/entities/film-person.model';
import { EmailConfirmationModel } from '../email/entities/email-confirmation.model';
import { SeriesModel } from '../series/entities/series.model';
import { FilmModel } from '../film/entities/film.model';
import { PersonModel } from '../person/entities/person.model';
import { SeasonModel } from '../season/entities/season.model';
import { UserModel } from '../user/entities/user.model';

export interface IDataLoaders {
  emailConfirmationLoader: DataLoader<string, EmailConfirmationModel>;
  filmLoader: DataLoader<string, FilmModel>;
  filmPersonLoader: DataLoader<number, FilmPersonModel>;
  personLoader: DataLoader<number, PersonModel>;
  seasonLoader: DataLoader<string, SeasonModel>;
  seriesLoader: DataLoader<string, SeriesModel>;
  userLoader: DataLoader<string, UserModel>;
}
