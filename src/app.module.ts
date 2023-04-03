import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FilmModule } from './film/film.module';
import { UserModule } from './user/user.module';
import { EpisodeModule } from './episode/episode.module';
import { SeasonModule } from './season/season.module';
import { SeriesModule } from './series/series.module';
import { GenreModule } from './genre/genre.module';
import { PersonModule } from './person/person.module';
import { StudioModule } from './studio/studio.module';
import { MoviePersonModule } from './movie-person/movie-person.module';
import { AuthModule } from './auth/auth.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { DataLoaderModule } from './dataloader/data-loader.module';
import { DataLoaderService } from './dataloader/data-loader.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GqlThrottlerGuard } from '@utils/gql-throttler.guard';
import { ErrorInterceptor } from '@utils/error.interceptor';
import { MediaModule } from './media/media.module';
import { CountryModule } from './country/country.module';
import { StudioCountryModule } from './studio-country/studio-country.module';
import { MovieGenreModule } from './movie-genre/movie-genre.module';
import { MovieStudioModule } from './movie-studio/movie-studio.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { v2 } from 'cloudinary';
import { MovieImageModule } from './movie-image/movie-image.module';
import { MovieModule } from './movie/movie.module';
import { TrailerModule } from './trailer/trailer.module';
import { MovieReviewModule } from './movie-review/movie-review.module';
import { MovieUserModule } from './movie-user/movie-user.module';
import { MovieCountryModule } from './movie-country/movie-country.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectionModule } from './collection/collection.module';
import { CollectionMovieModule } from './collection-movie/collection-movie.module';
import { MovieImageTypeModule } from './movie-image-type/movie-image-type.module';
import { MoviePersonTypeModule } from './movie-person-type/movie-person-type.module';
import { CurrencyModule } from './currency/currency.module';
import { RoomParticipantModule } from './room-participant/room-participant.module';
import { RoomModule } from './room/room.module';
import { MovieVisitStatsModule } from './movie-visit-stats/movie-visit-stats.module';
import { LanguageModule } from './language/language.module';
import { RoomVideoModule } from './room-video/room-video.module';
import { VideoModule } from './video/video.module';
import { SubtitlesModule } from './subtitles/subtitles.module';
import { VideoVariantModule } from './video-variant/video-variant.module';
import { CaslModule } from './casl/casl.module';
import { GraphQLConfig } from './config/graphql.config';
import { TypeOrmConfig } from './config/typeorm.config';
import { ThrottlerConfig } from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [DataLoaderService],
      useClass: GraphQLConfig,
    }),
    ThrottlerModule.forRootAsync({
      useClass: ThrottlerConfig,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    CloudinaryModule,
    CollectionModule,
    CollectionMovieModule,
    CountryModule,
    DataLoaderModule,
    EmailConfirmationModule,
    EpisodeModule,
    FilmModule,
    GenreModule,
    MediaModule,
    MovieCountryModule,
    MovieGenreModule,
    MovieImageModule,
    MovieModule,
    MoviePersonModule,
    MovieStudioModule,
    PersonModule,
    RefreshTokenModule,
    MovieReviewModule,
    SeasonModule,
    SeriesModule,
    StudioCountryModule,
    StudioModule,
    TrailerModule,
    UserModule,
    VideoModule,
    LanguageModule,
    MovieUserModule,
    MovieImageTypeModule,
    MoviePersonTypeModule,
    CurrencyModule,
    RoomModule,
    RoomParticipantModule,
    RoomVideoModule,
    MovieVisitStatsModule,
    VideoVariantModule,
    SubtitlesModule,
    CaslModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        v2.config({
          api_key: configService.get('CLOUD_API_KEY'),
          api_secret: configService.get('CLOUD_API_SECRET'),
          cloud_name: configService.get('CLOUD_NAME'),
        }),
    },
  ],
})
export class AppModule {}
