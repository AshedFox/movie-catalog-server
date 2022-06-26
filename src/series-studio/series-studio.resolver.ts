import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeriesStudioService } from './series-studio.service';
import { SeriesStudioModel } from './entities/series-studio.model';
import { ParseUUIDPipe } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { StudioModel } from '../studio/entities/studio.model';
import { SeriesModel } from '../series/entities/series.model';

@Resolver(() => SeriesStudioModel)
export class SeriesStudioResolver {
  constructor(private readonly seriesStudioService: SeriesStudioService) {}

  @Mutation(() => SeriesStudioModel)
  createSeriesStudio(
    @Args('seriesId', ParseUUIDPipe) seriesId: string,
    @Args('studioId', { type: () => Int }) studioId: number,
  ) {
    return this.seriesStudioService.create(seriesId, studioId);
  }

  @Mutation(() => SeriesStudioModel)
  deleteSeriesStudio(
    @Args('seriesId', ParseUUIDPipe) seriesId: string,
    @Args('studioId', { type: () => Int }) studioId: number,
  ) {
    return this.seriesStudioService.delete(seriesId, studioId);
  }

  @ResolveField(() => SeriesModel)
  series(
    @Parent() seriesStudio: SeriesStudioModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(seriesStudio.seriesId);
  }

  @ResolveField(() => StudioModel)
  studio(
    @Parent() seriesStudio: SeriesStudioModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studioLoader.load(seriesStudio.studioId);
  }
}
