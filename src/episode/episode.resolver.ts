import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EpisodeService } from './episode.service';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeModel } from './entities/episode.model';
import { PaginatedEpisodes } from './dto/paginated-episodes.result';
import { GetEpisodesArgs } from './dto/get-episodes.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SeasonModel } from '../season/entities/season.model';
import { SeriesModel } from '../series/entities/series.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import { VideoModel } from '../video/entities/video.model';
import { ImageModel } from '../image/entities/image.model';

@Resolver(EpisodeModel)
export class EpisodeResolver {
  constructor(private readonly episodeService: EpisodeService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => EpisodeModel)
  createEpisode(@Args('input') input: CreateEpisodeInput) {
    return this.episodeService.create(input);
  }

  @Query(() => PaginatedEpisodes)
  getEpisodes(@Args() { searchTitle, seasonId, take, skip }: GetEpisodesArgs) {
    return this.episodeService.readAll(take, skip, searchTitle, seasonId);
  }

  @Query(() => EpisodeModel, { nullable: true })
  getEpisode(@Args('id', ParseUUIDPipe) id: string) {
    return this.episodeService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => EpisodeModel)
  updateEpisode(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateEpisodeInput,
  ) {
    return this.episodeService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteEpisode(@Args('id', ParseUUIDPipe) id: string) {
    return this.episodeService.delete(id);
  }

  @ResolveField(() => SeasonModel)
  season(
    @Parent() episode: EpisodeModel,
    @Context('loader') loaders: IDataLoaders,
  ) {
    return episode.seasonId
      ? loaders.seasonLoader.load(episode.seasonId)
      : undefined;
  }

  @ResolveField(() => SeriesModel)
  series(
    @Parent() episode: EpisodeModel,
    @Context('loader') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(episode.seriesId);
  }

  @ResolveField(() => VideoModel)
  video(
    @Parent() episode: EpisodeModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return episode.videoId
      ? loaders.videoLoader.load(episode.videoId)
      : undefined;
  }

  @ResolveField(() => [ImageModel])
  posters(
    @Parent() episode: EpisodeModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.postersByEpisodeLoader.load(episode.id);
  }
}
