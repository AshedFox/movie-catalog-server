import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EpisodePosterService } from './episode-poster.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { ImageModel } from '../image/entities/image.model';
import { EpisodePosterModel } from './entities/episode-poster.model';
import { EpisodeModel } from '../episode/entities/episode.model';

@Resolver(() => EpisodePosterModel)
export class EpisodePosterResolver {
  constructor(private readonly episodePosterService: EpisodePosterService) {}

  @Mutation(() => EpisodePosterModel)
  createEpisodePoster(
    @Args('episodeId', ParseUUIDPipe) episodeId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.episodePosterService.create(episodeId, imageId);
  }

  @Mutation(() => EpisodePosterModel)
  deleteEpisodePoster(
    @Args('episodeId', ParseUUIDPipe) episodeId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.episodePosterService.delete(episodeId, imageId);
  }

  @ResolveField(() => EpisodeModel)
  episode(
    @Parent() episodePoster: EpisodePosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.episodeLoader.load(episodePoster.episodeId);
  }

  @ResolveField(() => ImageModel)
  poster(
    @Parent() episodePoster: EpisodePosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.imageLoader.load(episodePoster.imageId);
  }
}
