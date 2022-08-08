import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MoviePersonModule } from './movie-person/movie-person.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { DataLoaderModule } from './dataloader/data-loader.module';
import { DataLoaderService } from './dataloader/data-loader.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GqlThrottlerGuard } from './utils/gql-throttler.guard';
import { ErrorInterceptor } from './utils/error.interceptor';
import { VideoModule } from './video/video.module';
import { CountryModule } from './country/country.module';
import { ImageModule } from './image/image.module';
import { StudioCountryModule } from './studio-country/studio-country.module';
import { MovieGenreModule } from './movie-genre/movie-genre.module';
import { MovieStudioModule } from './movie-studio/movie-studio.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { v2 } from 'cloudinary';
import { MovieImageModule } from './movie-image/movie-image.module';
import { MovieModule } from './movie/movie.module';
import { TrailerModule } from './trailer/trailer.module';
import { ReviewModule } from './review/review.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('CONNECTION_STRING'),
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
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
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('THROTTLER_TTL'),
        limit: configService.get('THROTTLER_LIMIT'),
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    CloudinaryModule,
    CountryModule,
    DataLoaderModule,
    EmailModule,
    EpisodeModule,
    FilmModule,
    GenreModule,
    ImageModule,
    MovieGenreModule,
    MovieImageModule,
    MovieModule,
    MoviePersonModule,
    MovieStudioModule,
    PersonModule,
    RefreshTokenModule,
    ReviewModule,
    SeasonModule,
    SeriesModule,
    StudioCountryModule,
    StudioModule,
    TrailerModule,
    UserModule,
    VideoModule,
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
