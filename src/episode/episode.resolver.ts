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
import { EpisodeEntity } from './entities/episode.entity';
import { PaginatedEpisodes } from './dto/paginated-episodes';
import { GetEpisodesArgs } from './dto/get-episodes.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SeasonEntity } from '../season/entities/season.entity';
import { SeriesEntity } from '../series/entities/series.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { VideoEntity } from '../video/entities/video.entity';

@Resolver(EpisodeEntity)
export class EpisodeResolver {
  constructor(private readonly episodeService: EpisodeService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => EpisodeEntity)
  createEpisode(@Args('input') input: CreateEpisodeInput) {
    return this.episodeService.create(input);
  }

  @Query(() => PaginatedEpisodes)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  getEpisodesProtected(@Args() { filter, sort, pagination }: GetEpisodesArgs) {
    return this.episodeService.readMany(pagination, sort, filter);
  }

  @Query(() => PaginatedEpisodes)
  getEpisodes(@Args() { filter, sort, pagination }: GetEpisodesArgs) {
    if (!filter) {
      filter = {};
    }
    filter.accessMode = { eq: AccessModeEnum.PUBLIC };
    return this.episodeService.readMany(pagination, sort, filter);
  }

  @Query(() => EpisodeEntity)
  getEpisode(@Args('id', ParseUUIDPipe) id: string) {
    return this.episodeService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => EpisodeEntity)
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

  @ResolveField(() => SeasonEntity)
  season(
    @Parent() episode: EpisodeEntity,
    @Context('loader') loaders: IDataLoaders,
  ) {
    return episode.seasonId
      ? loaders.seasonLoader.load(episode.seasonId)
      : undefined;
  }

  @ResolveField(() => SeriesEntity)
  series(
    @Parent() episode: EpisodeEntity,
    @Context('loader') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(episode.seriesId);
  }

  @ResolveField(() => VideoEntity)
  video(
    @Parent() episode: EpisodeEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return episode.videoId
      ? loaders.videoLoader.load(episode.videoId)
      : undefined;
  }
}
