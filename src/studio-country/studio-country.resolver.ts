import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { StudioCountryService } from './studio-country.service';
import { StudioCountryModel } from './entities/studio-country.model';
import { CountryModel } from '../country/entities/country.model';
import { StudioModel } from '../studio/entities/studio.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';

@Resolver(() => StudioCountryModel)
export class StudioCountryResolver {
  constructor(private readonly studioCountryService: StudioCountryService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioCountryModel)
  createStudioCountry(
    @Args('studioId', { type: () => Int }) studioId: number,
    @Args('countryId', { type: () => Int }) countryId: number,
  ) {
    return this.studioCountryService.create(studioId, countryId);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteStudioCountry(
    @Args('studioId', { type: () => Int }) studioId: number,
    @Args('countryId', { type: () => Int }) countryId: number,
  ) {
    return this.studioCountryService.delete(studioId, countryId);
  }

  @ResolveField(() => StudioModel)
  studio(
    @Parent() studioCountry: StudioCountryModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studioLoader.load(studioCountry.studioId);
  }

  @ResolveField(() => CountryModel)
  country(
    @Parent() studioCountry: StudioCountryModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.countryLoader.load(studioCountry.countryId);
  }
}
