import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SeasonService } from './season.service';
import { CreateSeasonInput } from './dto/create-season.input';
import { UpdateSeasonInput } from './dto/update-season.input';
import { GetSeasonsArgs } from './dto/get-seasons.args';
import { SeasonModel } from './entities/season.model';
import { PaginatedSeasons } from './dto/paginated-seasons.result';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(SeasonModel)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @Mutation(() => SeasonModel)
  createSeason(@Args('input') input: CreateSeasonInput) {
    return this.seasonService.create(input);
  }

  @Query(() => PaginatedSeasons)
  getSeasons(@Args() { searchTitle, seasonId, take, skip }: GetSeasonsArgs) {
    return this.seasonService.readAll(searchTitle, seasonId, take, skip);
  }

  @Query(() => SeasonModel, { nullable: true })
  getSeason(@Args('id', ParseUUIDPipe) id: string) {
    return this.seasonService.readOne(id);
  }

  @Mutation(() => SeasonModel)
  updateSeason(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateSeasonInput,
  ) {
    return this.seasonService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteSeason(@Args('id', ParseUUIDPipe) id: string) {
    return this.seasonService.delete(id);
  }
}
