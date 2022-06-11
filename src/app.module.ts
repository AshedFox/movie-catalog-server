import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeModel } from './episode/entities/episode.model';
import { FilmModel } from './film/entities/film.model';
import { FilmPersonModel } from './film-person/entities/film-person.model';
import { GenreModel } from './genre/entities/genre.model';
import { PersonModel } from './person/entities/person.model';
import { SeasonModel } from './season/entities/season.model';
import { SeriesModel } from './series/entities/series.model';
import { SeriesPersonModel } from './series-person/entities/series-person.model';
import { StudioModel } from './studio/entities/studio.model';
import { UserModel } from './user/entities/user.model';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { FilmModule } from './film/film.module';
import { UserModule } from './user/user.module';
import { EpisodeModule } from './episode/episode.module';
import { SeasonModule } from './season/season.module';
import { SeriesModule } from './series/series.module';
import { GenreModule } from './genre/genre.module';
import { PersonModule } from './person/person.module';
import { StudioModule } from './studio/studio.module';
import { FilmPersonModule } from './film-person/film-person.module';
import { SeriesPersonModule } from './series-person/series-person.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      schema: 'public',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'movies-catalog',
      entities: [
        EpisodeModel,
        FilmModel,
        FilmPersonModel,
        GenreModel,
        PersonModel,
        SeasonModel,
        SeriesModel,
        SeriesPersonModel,
        StudioModel,
        UserModel,
      ],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.graphql',
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    FilmModule,
    UserModule,
    EpisodeModule,
    SeasonModule,
    SeriesModule,
    GenreModule,
    PersonModule,
    StudioModule,
    FilmPersonModule,
    SeriesPersonModule,
  ],
})
export class AppModule {}
