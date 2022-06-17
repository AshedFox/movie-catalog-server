import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { DataLoaderModule } from './dataloader/data-loader.module';
import { DataLoaderService } from './dataloader/data-loader.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.CONNECTION_STRING,
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [DataLoaderService],
      useFactory: (dataLoaderService: DataLoaderService) => ({
        context: ({ req }) => ({
          req,
          loaders: dataLoaderService.createLoaders(),
        }),
        introspection: true,
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
    DataLoaderModule,
  ],
})
export class AppModule {}
