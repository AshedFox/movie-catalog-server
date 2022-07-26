import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { PaginatedSeries } from './dto/paginated-series.result';
import { GetSeriesArgs } from './dto/get-series.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import { SeriesPersonModel } from '../series-person/entities/series-person.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GenreModel } from '../genre/entities/genre.model';
import { StudioModel } from '../studio/entities/studio.model';
import { SeasonModel } from '../season/entities/season.model';
import { EpisodeModel } from '../episode/entities/episode.model';
import { ImageModel } from '../image/entities/image.model';

@Resolver(SeriesModel)
export class SeriesResolver {
  constructor(private readonly seriesService: SeriesService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesModel)
  createSeries(@Args('input') input: CreateSeriesInput) {
    return this.seriesService.create(input);
  }

  @Query(() => PaginatedSeries)
  getAllSeries(@Args() { searchTitle, take, skip }: GetSeriesArgs) {
    return this.seriesService.readAll(searchTitle, take, skip);
  }

  @Query(() => SeriesModel, { nullable: true })
  getOneSeries(@Args('id', ParseUUIDPipe) id: string) {
    return this.seriesService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesModel)
  updateSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateSeriesInput,
  ) {
    return this.seriesService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteSeries(@Args('id', ParseUUIDPipe) id: string) {
    return this.seriesService.delete(id);
  }

  @ResolveField(() => [SeriesPersonModel])
  seriesPersons(
    @Parent() series: SeriesModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seriesPersonsBySeriesLoader.load(series.id);
  }

  @ResolveField(() => [GenreModel])
  genres(
    @Parent() series: SeriesModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.genresBySeriesLoader.load(series.id);
  }

  @ResolveField(() => [StudioModel])
  studios(
    @Parent() series: SeriesModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studiosBySeriesLoader.load(series.id);
  }

  @ResolveField(() => [SeasonModel])
  seasons(
    @Parent() series: SeriesModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seasonsBySeriesLoader.load(series.id);
  }

  @ResolveField(() => [EpisodeModel])
  episodes(
    @Parent() series: SeriesModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.episodesBySeriesLoader.load(series.id);
  }

  @ResolveField(() => [ImageModel])
  posters(
    @Parent() series: SeriesModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.postersBySeriesLoader.load(series.id);
  }
}
