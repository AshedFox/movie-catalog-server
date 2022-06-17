import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SeriesPersonService } from './series-person.service';
import { CreateSeriesPersonInput } from './dto/create-series-person.input';
import { UpdateSeriesPersonInput } from './dto/update-series-person.input';
import { SeriesPersonModel } from './entities/series-person.model';
import { ParseIntPipe } from '@nestjs/common';
import { GetSeriesPersonsArgs } from './dto/get-series-persons.args';
import { PaginatedSeriesPersons } from './dto/paginated-series-persons.result';
import { SeriesModel } from '../series/entities/series.model';
import { PersonModel } from '../person/entities/person.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(SeriesPersonModel)
export class SeriesPersonResolver {
  constructor(private readonly seriesPersonService: SeriesPersonService) {}

  @Mutation(() => SeriesPersonModel)
  createSeriesPerson(
    @Args('input') createSeriesPersonInput: CreateSeriesPersonInput,
  ) {
    return this.seriesPersonService.create(createSeriesPersonInput);
  }

  @Query(() => PaginatedSeriesPersons)
  getSeriesPersons(
    @Args() { personId, seriesId, type, take, skip }: GetSeriesPersonsArgs,
  ) {
    return this.seriesPersonService.readAll(
      take,
      skip,
      seriesId,
      personId,
      type,
    );
  }

  @Query(() => SeriesPersonModel, { nullable: true })
  getSeriesPerson(@Args('id', ParseIntPipe) id: number) {
    return this.seriesPersonService.readOne(id);
  }

  @Mutation(() => SeriesPersonModel)
  updateSeriesPerson(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updateSeriesPersonInput: UpdateSeriesPersonInput,
  ) {
    return this.seriesPersonService.update(id, updateSeriesPersonInput);
  }

  @Mutation(() => Boolean)
  deleteSeriesPerson(@Args('id', ParseIntPipe) id: number) {
    return this.seriesPersonService.delete(id);
  }

  @ResolveField(() => SeriesModel)
  series(
    @Parent() seriesPerson: SeriesPersonModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(seriesPerson.seriesId);
  }

  @ResolveField(() => PersonModel)
  person(
    @Parent() seriesPerson: SeriesPersonModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.personLoader.load(seriesPerson.personId);
  }
}
