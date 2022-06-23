import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { PaginatedSeries } from './dto/paginated-series.result';
import { GetSeriesArgs } from './dto/get-series.args';
import { ParseArrayPipe, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../shared/role.enum';

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
  @Mutation(() => SeriesModel)
  addGenresToSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'genresIds', type: () => [String] }, ParseArrayPipe)
    genresIds: string[],
  ) {
    return this.seriesService.addGenresToSeries(id, genresIds);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesModel)
  deleteGenresFromSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'genresIds', type: () => [String] }, ParseArrayPipe)
    genresIds: string[],
  ) {
    return this.seriesService.deleteGenresFromSeries(id, genresIds);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesModel)
  addStudiosToSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'studiosIds', type: () => [Number] }, ParseArrayPipe)
    studiosIds: number[],
  ) {
    return this.seriesService.addStudiosToSeries(id, studiosIds);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeriesModel)
  deleteStudiosFromSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'studiosIds', type: () => [Number] }, ParseArrayPipe)
    studiosIds: number[],
  ) {
    return this.seriesService.deleteStudiosFromSeries(id, studiosIds);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteSeries(@Args('id', ParseUUIDPipe) id: string) {
    return this.seriesService.delete(id);
  }
}
