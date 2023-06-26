import {
  Args,
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
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { VideoEntity } from '../video/entities/video.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { MediaEntity } from '../media/entities/media.entity';

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
  async getEpisodesProtected(
    @Args() { sort, filter, ...pagination }: GetEpisodesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.episodeService.readMany(pagination, sort, filter),
      this.episodeService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => PaginatedEpisodes)
  async getEpisodes(@Args() { sort, filter, ...pagination }: GetEpisodesArgs) {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };
    const [data, count] = await Promise.all([
      this.episodeService.readMany(pagination, sort, filter),
      this.episodeService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
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
  @Mutation(() => EpisodeEntity)
  deleteEpisode(@Args('id', ParseUUIDPipe) id: string) {
    return this.episodeService.delete(id);
  }

  @ResolveField(() => SeasonEntity)
  season(
    @Parent() episode: EpisodeEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return episode.seasonId
      ? loadersFactory
          .createOrGetLoader(SeasonEntity, 'id')
          .load(episode.seasonId)
      : undefined;
  }

  @ResolveField(() => SeriesEntity)
  series(
    @Parent() episode: EpisodeEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(SeriesEntity, 'id')
      .load(episode.seriesId);
  }

  @ResolveField(() => MediaEntity)
  cover(
    @Parent() episode: EpisodeEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return episode.coverId
      ? loadersFactory
          .createOrGetLoader(MediaEntity, 'id')
          .load(episode.coverId)
      : undefined;
  }

  @ResolveField(() => VideoEntity)
  video(
    @Parent() episode: EpisodeEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return episode.videoId
      ? loadersFactory
          .createOrGetLoader(VideoEntity, 'id')
          .load(episode.videoId)
      : undefined;
  }
}
