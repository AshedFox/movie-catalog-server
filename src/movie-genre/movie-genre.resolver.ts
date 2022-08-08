import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieGenreService } from './movie-genre.service';
import { MovieGenreEntity } from './entities/movie-genre.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GenreEntity } from '../genre/entities/genre.entity';

@Resolver(() => MovieGenreEntity)
export class MovieGenreResolver {
  constructor(private readonly movieGenreService: MovieGenreService) {}

  @Mutation(() => MovieGenreEntity)
  createMovieGenre(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.movieGenreService.create(movieId, genreId);
  }

  @Mutation(() => Boolean)
  deleteMovieGenre(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.movieGenreService.delete(movieId, genreId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieGenre: MovieGenreEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(movieGenre.movieId);
  }

  @ResolveField(() => GenreEntity)
  genre(
    @Parent() movieGenre: MovieGenreEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.genreLoader.load(movieGenre.genreId);
  }
}
