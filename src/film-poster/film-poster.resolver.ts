import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FilmPosterService } from './film-poster.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { FilmModel } from '../film/entities/film.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { FilmPosterModel } from './entities/film-poster.model';
import { ImageModel } from '../image/entities/image.model';

@Resolver(() => FilmPosterModel)
export class FilmPosterResolver {
  constructor(private readonly filmPosterService: FilmPosterService) {}

  @Mutation(() => FilmPosterModel)
  createFilmPoster(
    @Args('filmId', ParseUUIDPipe) filmId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.filmPosterService.create(filmId, imageId);
  }

  @Mutation(() => FilmPosterModel)
  deleteFilmPoster(
    @Args('filmId', ParseUUIDPipe) filmId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.filmPosterService.delete(filmId, imageId);
  }

  @ResolveField(() => FilmModel)
  film(
    @Parent() filmPoster: FilmPosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.filmLoader.load(filmPoster.filmId);
  }

  @ResolveField(() => ImageModel)
  poster(
    @Parent() filmPoster: FilmPosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.imageLoader.load(filmPoster.imageId);
  }
}
