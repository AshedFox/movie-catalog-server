import { Module, ValidationPipe } from '@nestjs/common';
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
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GqlThrottlerGuard } from './shared/gql-throttler.guard';
import { ErrorInterceptor } from './shared/error.interceptor';
import { VideoModule } from './video/video.module';
import { CountryModule } from './country/country.module';
import { QualityModule } from './quality/quality.module';
import { ImageModule } from './image/image.module';
import { StudioCountryModule } from './studio-country/studio-country.module';
import { FilmGenreModule } from './film-genre/film-genre.module';
import { FilmStudioModule } from './film-studio/film-studio.module';
import { SeriesStudioModule } from './series-studio/series-studio.module';
import { SeriesGenreModule } from './series-genre/series-genre.module';
import { VideoQualityModule } from './video-quality/video-quality.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { v2 } from 'cloudinary';

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
        context: ({ req, res }) => ({
          req,
          res,
          loaders: dataLoaderService.createLoaders(),
        }),
        introspection: true,
        autoSchemaFile: 'src/schema.graphql',
        installSubscriptionHandlers: true,
        cors: {
          credentials: true,
          origin: true,
        },
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
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 10,
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
    RefreshTokenModule,
    VideoModule,
    CountryModule,
    QualityModule,
    ImageModule,
    StudioCountryModule,
    FilmGenreModule,
    FilmStudioModule,
    SeriesStudioModule,
    SeriesGenreModule,
    VideoQualityModule,
    CloudinaryModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    {
      provide: 'CLOUDINARY',
      useFactory: () =>
        v2.config({
          api_key: process.env.CLOUD_API_KEY,
          api_secret: process.env.CLOUD_API_SECRET,
          cloud_name: process.env.CLOUD_NAME,
        }),
    },
  ],
})
export class AppModule {}
