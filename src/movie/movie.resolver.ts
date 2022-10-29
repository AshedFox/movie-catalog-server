import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieEntity } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { GetMoviesArgs } from './dto/get-movies.args';
import { MovieService } from './movie.service';
import { UpdateMovieInput } from './dto/update-movie.input';
import { PaginatedMovies } from './dto/paginated-movies';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MoviePersonEntity } from '../movie-person/entities/movie-person.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { MovieImageEntity } from '../movie-image/entities/movie-image.entity';
import { ImageEntity } from '../image/entities/image.entity';
import { TrailerEntity } from '../trailer/entities/trailer.entity';
import { MovieReviewEntity } from '../movie-review/entities/movie-review.entity';
import { CountryEntity } from '../country/entities/country.entity';

@Resolver(MovieEntity)
export class MovieResolver {
  constructor(private readonly movieService: MovieService) {}

  @Mutation(() => MovieEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createMovie(@Args('input') input: CreateMovieInput) {
    return this.movieService.create(input);
  }

  @Query(() => PaginatedMovies)
  getMovies(@Args() { pagination, sort, filter }: GetMoviesArgs) {
    return this.movieService.readMany(pagination, sort, filter);
  }

  @Query(() => MovieEntity, { nullable: true })
  getMovie(@Args('id', ParseUUIDPipe) id: string) {
    return this.movieService.readOne(id);
  }

  @Mutation(() => MovieEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  updateMovie(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateMovieInput,
  ) {
    return this.movieService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteMovie(@Args('id', ParseUUIDPipe) id: string) {
    return this.movieService.delete(id);
  }

  @ResolveField(() => ImageEntity, { nullable: true })
  cover(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return movie.coverId ? loaders.imageLoader.load(movie.coverId) : undefined;
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
