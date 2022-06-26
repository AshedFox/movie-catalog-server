import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeriesGenreService } from './series-genre.service';
import { SeriesGenreModel } from './entities/series-genre.model';
import { ParseUUIDPipe } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GenreModel } from '../genre/entities/genre.model';
import { SeriesModel } from '../series/entities/series.model';

@Resolver(() => SeriesGenreModel)
export class SeriesGenreResolver {
  constructor(private readonly seriesGenreService: SeriesGenreService) {}

  @Mutation(() => SeriesGenreModel)
  createSeriesGenre(
    @Args('seriesId', ParseUUIDPipe) seriesId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.seriesGenreService.create(seriesId, genreId);
  }

  @Mutation(() => SeriesGenreModel)
  deleteSeriesGenre(
    @Args('seriesId', ParseUUIDPipe) seriesId: string,
    @Args('genreId', ParseUUIDPipe) genreId: string,
  ) {
    return this.seriesGenreService.delete(seriesId, genreId);
  }

  @ResolveField(() => SeriesModel)
  series(
    @Parent() seriesGenre: SeriesGenreModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(seriesGenre.seriesId);
  }

  @ResolveField(() => GenreModel)
  genre(
    @Parent() seriesGenre: SeriesGenreModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.genreLoader.load(seriesGenre.genreId);
  }
}
