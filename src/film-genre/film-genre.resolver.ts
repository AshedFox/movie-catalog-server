import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FilmGenreService } from './film-genre.service';
import { FilmGenreModel } from './entities/film-genre.model';
import { ParseUUIDPipe } from '@nestjs/common';
import { FilmModel } from '../film/entities/film.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GenreModel } from '../genre/entities/genre.model';

@Resolver(() => FilmGenreModel)
export class FilmGenreResolver {
  constructor(private readonly filmGenreService: FilmGenreService) {}

  @Mutation(() => FilmGenreModel)
  createFilmGenre(
    @Args('filmId', ParseUUIDPipe) filmId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.filmGenreService.create(filmId, genreId);
  }

  @Mutation(() => FilmGenreModel)
  deleteFilmGenre(
    @Args('filmId', ParseUUIDPipe) filmId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.filmGenreService.delete(filmId, genreId);
  }

  @ResolveField(() => FilmModel)
  film(
    @Parent() filmGenre: FilmGenreModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.filmLoader.load(filmGenre.filmId);
  }

  @ResolveField(() => GenreModel)
  genre(
    @Parent() filmGenre: FilmGenreModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.genreLoader.load(filmGenre.genreId);
  }
}
