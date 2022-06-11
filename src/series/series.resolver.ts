import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { CreateSeriesInput } from './dto/create-series.input';
import { UpdateSeriesInput } from './dto/update-series.input';
import { SeriesModel } from './entities/series.model';
import { PaginatedSeries } from './dto/paginated-series.result';
import { GetSeriesArgs } from './dto/get-series.args';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(SeriesModel)
export class SeriesResolver {
  constructor(private readonly seriesService: SeriesService) {}

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

  @Mutation(() => SeriesModel)
  updateSeries(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateSeriesInput,
  ) {
    return this.seriesService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteSeries(@Args('id', ParseUUIDPipe) id: string) {
    return this.seriesService.delete(id);
  }
}
