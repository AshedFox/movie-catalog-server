import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeasonService } from './season.service';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { GetSeasonsArgs } from './dto/get-seasons.args';
import { SeasonEntity } from './entities/season.entity';
import { PaginatedSeasons } from './dto/paginated-seasons';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SeriesEntity } from '../series/entities/series.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { RoleEnum } from '@utils/enums';
import { EpisodeEntity } from '../episode/entities/episode.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { FilterType, Filterable } from '@common/filter';
import { SortType, Sortable } from '@common/sort';

@Resolver(SeasonEntity)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeasonEntity)
  createSeason(@Args('input') input: CreateSeasonInput) {
    return this.seasonService.create(input);
  }

  @Query(() => [SeasonEntity])
  getAllSeasons(
    @Args('filter', { type: () => Filterable(SeasonEntity), nullable: true })
    filter?: FilterType<SeasonEntity>,
    @Args('sort', { type: () => Sortable(SeasonEntity), nullable: true })
    sort?: SortType<SeasonEntity>,
  ) {
    return this.seasonService.readMany(undefined, sort, {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    });
  }

  @Query(() => PaginatedSeasons)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  async getSeasonsProtected(
    @Args() { sort, filter, ...pagination }: GetSeasonsArgs,
  ) {
    const [data, count] = await Promise.all([
      this.seasonService.readMany(pagination, sort, filter),
      this.seasonService.count(filter),
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

  @Query(() => PaginatedSeasons)
  async getSeasons(@Args() { sort, filter, ...pagination }: GetSeasonsArgs) {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };
    const [data, count] = await Promise.all([
      this.seasonService.readMany(pagination, sort, filter),
      this.seasonService.count(filter),
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

  @Query(() => SeasonEntity)
  getSeason(@Args('id', ParseUUIDPipe) id: string) {
    return this.seasonService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeasonEntity)
  updateSeason(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateSeasonInput,
  ) {
    return this.seasonService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeasonEntity)
  deleteSeason(@Args('id', ParseUUIDPipe) id: string) {
    return this.seasonService.delete(id);
  }

  @ResolveField(() => SeriesEntity)
  series(
    @Parent() season: SeasonEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(SeriesEntity, 'id')
      .load(season.seriesId);
  }

  @ResolveField(() => [EpisodeEntity])
  episodes(
    @Parent() season: SeasonEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(EpisodeEntity, 'seasonId', SeasonEntity, 'id')
      .load({ id: season.id });
  }
}
