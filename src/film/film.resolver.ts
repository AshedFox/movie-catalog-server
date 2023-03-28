import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FilmEntity } from './entities/film.entity';
import { CreateFilmInput } from './dto/create-film.input';
import { GetFilmsArgs } from './dto/get-films.args';
import { FilmService } from './film.service';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MoviePersonEntity } from '../movie-person/entities/movie-person.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { MediaEntity } from '../media/entities/media.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { MovieImageEntity } from '../movie-image/entities/movie-image.entity';
import { TrailerEntity } from '../trailer/entities/trailer.entity';
import { MovieReviewEntity } from '../movie-review/entities/movie-review.entity';
import { CountryEntity } from '../country/entities/country.entity';

@Resolver(FilmEntity)
export class FilmResolver {
  constructor(private readonly filmService: FilmService) {}

  @Mutation(() => FilmEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createFilm(@Args('input') input: CreateFilmInput) {
    return this.filmService.create(input);
  }

  @Query(() => PaginatedFilms)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  async getFilmsProtected(
    @Args() { sort, filter, ...pagination }: GetFilmsArgs,
  ): Promise<PaginatedFilms> {
    const [data, count] = await Promise.all([
      this.filmService.readMany(pagination, sort, filter),
      this.filmService.count(filter),
    ]);

    const { take, skip } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > take + skip,
        hasPreviousPage: skip > 0,
      },
    };
  }

  @Query(() => PaginatedFilms)
  async getFilms(
    @Args() { sort, filter, ...pagination }: GetFilmsArgs,
  ): Promise<PaginatedFilms> {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };
    const [data, count] = await Promise.all([
      this.filmService.readMany(pagination, sort, filter),
      this.filmService.count(filter),
    ]);

    const { take, skip } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > take + skip,
        hasPreviousPage: skip > 0,
      },
    };
  }

  @Query(() => FilmEntity)
  getFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.readOne(id);
  }

  @Mutation(() => FilmEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  updateFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateFilmInput,
  ) {
    return this.filmService.update(id, input);
  }

  @Mutation(() => FilmEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.delete(id);
  }

  @ResolveField(() => VideoEntity, { nullable: true })
  video(@Parent() film: FilmEntity, @Context('loaders') loaders: IDataLoaders) {
    return film.videoId ? loaders.videoLoader.load(film.videoId) : undefined;
  }

  @ResolveField(() => MediaEntity, { nullable: true })
  cover(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return movie.coverId ? loaders.mediaLoader.load(movie.coverId) : undefined;
  }

  @ResolveField(() => [TrailerEntity])
  trailers(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.trailersByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [MovieReviewEntity])
  reviews(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieReviewsByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [MoviePersonEntity])
  moviePersons(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.moviePersonsByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [MovieImageEntity])
  movieImages(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieImagesByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [GenreEntity])
  genres(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.genresByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [CountryEntity])
  countries(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.countriesByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [StudioEntity])
  studios(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studiosByMovieLoader.load(movie.id);
  }
}
