import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeasonPosterService } from './season-poster.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { ImageModel } from '../image/entities/image.model';
import { SeasonPosterModel } from './entities/season-poster.model';
import { SeasonModel } from '../season/entities/season.model';

@Resolver(() => SeasonPosterModel)
export class SeasonPosterResolver {
  constructor(private readonly seasonPosterService: SeasonPosterService) {}

  @Mutation(() => SeasonPosterModel)
  createSeasonPoster(
    @Args('seasonId', ParseUUIDPipe) seasonId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.seasonPosterService.create(seasonId, imageId);
  }

  @Mutation(() => SeasonPosterModel)
  deleteSeasonPoster(
    @Args('seasonId', ParseUUIDPipe) seasonId: string,
    @Args('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.seasonPosterService.delete(seasonId, imageId);
  }

  @ResolveField(() => SeasonModel)
  season(
    @Parent() seasonPoster: SeasonPosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seasonLoader.load(seasonPoster.seasonId);
  }

  @ResolveField(() => ImageModel)
  poster(
    @Parent() seasonPoster: SeasonPosterModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.imageLoader.load(seasonPoster.imageId);
  }
}
