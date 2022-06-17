import { Module } from '@nestjs/common';
import { DataLoaderService } from './data-loader.service';
import { FilmPersonModule } from '../film-person/film-person.module';
import { SeriesModule } from '../series/series.module';
import { EmailModule } from '../email/email.module';
import { FilmModule } from '../film/film.module';
import { PersonModule } from '../person/person.module';
import { SeasonModule } from '../season/season.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    FilmPersonModule,
    SeriesModule,
    EmailModule,
    FilmModule,
    PersonModule,
    SeasonModule,
    UserModule,
  ],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
