import {
  Args,
  Context,
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
import { SeasonModel } from './entities/season.model';
import { PaginatedSeasons } from './dto/paginated-seasons.result';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SeriesModel } from '../series/entities/series.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../shared/role.enum';

@Resolver(SeasonModel)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
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

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => SeasonModel)
  updateSeason(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateSeasonInput,
  ) {
    return this.seasonService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteSeason(@Args('id', ParseUUIDPipe) id: string) {
    return this.seasonService.delete(id);
  }

  @ResolveField(() => SeriesModel)
  series(
    @Parent() season: SeasonModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.seriesLoader.load(season.seriesId);
  }
}
