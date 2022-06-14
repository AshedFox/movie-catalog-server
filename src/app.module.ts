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
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EmailConfirmationModel } from './email/entities/email-confirmation.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.CONNECTION_STRING,
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
        EmailConfirmationModel,
      ],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
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
    AuthModule,
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
    EmailModule,
  ],
})
export class AppModule {}
