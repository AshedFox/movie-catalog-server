import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FilmStudioService } from './film-studio.service';
import { FilmStudioModel } from './entities/film-studio.model';
import { ParseUUIDPipe } from '@nestjs/common';
import { FilmModel } from '../film/entities/film.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { StudioModel } from '../studio/entities/studio.model';

@Resolver(() => FilmStudioModel)
export class FilmStudioResolver {
  constructor(private readonly filmStudioService: FilmStudioService) {}

  @Mutation(() => FilmStudioModel)
  createFilmStudio(
    @Args('filmId', ParseUUIDPipe) filmId: string,
    @Args('studioId', { type: () => Int }) studioId: number,
  ) {
    return this.filmStudioService.create(filmId, studioId);
  }

  @Mutation(() => FilmStudioModel)
  deleteFilmStudio(
    @Args('filmId', ParseUUIDPipe) filmId: string,
    @Args('studioId', { type: () => Int }) studioId: number,
  ) {
    return this.filmStudioService.delete(filmId, studioId);
  }

  @ResolveField(() => FilmModel)
  film(
    @Parent() filmStudio: FilmStudioModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.filmLoader.load(filmStudio.filmId);
  }

  @ResolveField(() => StudioModel)
  studio(
    @Parent() filmStudio: FilmStudioModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studioLoader.load(filmStudio.studioId);
  }
}
