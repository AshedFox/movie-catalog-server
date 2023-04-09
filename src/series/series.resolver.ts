import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesEntity } from './entities/series.entity';
import { PaginatedSeries } from './dto/paginated-series';
import { GetSeriesArgs } from './dto/get-series.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { SeasonEntity } from '../season/entities/season.entity';
import { EpisodeEntity } from '../episode/entities/episode.entity';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { MediaService } from '../media/media.service';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { MovieInterfaceResolver } from '../movie/movie-interface.resolver';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(SeriesEntity)
export class SeriesResolver extends MovieInterfaceResolver {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly mediaService: MediaService,
  ) {
    super();
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesEntity)
  async createSeries(@Args('input') input: CreateSeriesInput) {
    if (input.cover) {
      const media = await this.mediaService.create({
        file: input.cover,
        type: MediaTypeEnum.IMAGE,
      });

      input.coverId = media.id;
      input.cover = undefined;
    }

    return this.seriesService.create(input);
  }

  @Query(() => PaginatedSeries)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  async getManySeriesProtected(
    @Args() { sort, filter, ...pagination }: GetSeriesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.seriesService.readMany(pagination, sort, filter),
      this.seriesService.count(filter),
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

  @Query(() => PaginatedSeries)
  async getManySeries(@Args() { sort, filter, ...pagination }: GetSeriesArgs) {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };

    const [data, count] = await Promise.all([
      this.seriesService.readMany(pagination, sort, filter),
      this.seriesService.count(filter),
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

  @Query(() => SeriesEntity)
  getOneSeries(@Args('id', ParseUUIDPipe) id: string) {
    return this.seriesService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesEntity)
  async updateSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateSeriesInput,
  ) {
    if (input.cover) {
      const media = await this.mediaService.create({
        file: input.cover,
        type: MediaTypeEnum.IMAGE,
      });

      input.coverId = media.id;
      input.cover = undefined;
    }

    return this.seriesService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesEntity)
  deleteSeries(@Args('id', ParseUUIDPipe) id: string) {
    return this.seriesService.delete(id);
  }

  @ResolveField(() => [SeasonEntity])
  seasons(
    @Parent() series: SeriesEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(SeasonEntity, 'seriesId', SeriesEntity, 'id')
      .load({ id: series.id });
  }

  @ResolveField(() => [EpisodeEntity])
  episodes(
    @Parent() series: SeriesEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(EpisodeEntity, 'seriesId', SeriesEntity, 'id')
      .load({ id: series.id });
  }
}
