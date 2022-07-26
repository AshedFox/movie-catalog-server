import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeriesPosterService } from './series-poster.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { ImageModel } from '../image/entities/image.model';
import { SeriesPosterModel } from './entities/series-poster.model';
import { SeriesModel } from '../series/entities/series.model';

@Resolver(() => SeriesPosterModel)
export class SeriesPosterResolver {
  constructor(private readonly seriesPosterService: SeriesPosterService) {}

  @Mutation(() => SeriesPosterModel)
  createSeriesPoster(
    @Args('seriesId', ParseUUIDPipe) seriesId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.seriesPosterService.create(seriesId, imageId);
  }

  @Mutation(() => SeriesPosterModel)
  deleteSeriesPoster(
    @Args('seriesId', ParseUUIDPipe) seriesId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.seriesPosterService.delete(seriesId, imageId);
  }

  @ResolveField(() => SeriesModel)
  series(
    @Parent() seriesPoster: SeriesPosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(seriesPoster.seriesId);
  }

  @ResolveField(() => ImageModel)
  poster(
    @Parent() seriesPoster: SeriesPosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.imageLoader.load(seriesPoster.imageId);
  }
}
