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
import { StudioCountryEntity } from './entities/studio-country.entity';
import { CountryEntity } from '../country/entities/country.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

@Resolver(() => StudioCountryEntity)
export class StudioCountryResolver {
  constructor(private readonly studioCountryService: StudioCountryService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioCountryEntity)
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

  @ResolveField(() => StudioEntity)
  studio(
    @Parent() studioCountry: StudioCountryEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studioLoader.load(studioCountry.studioId);
  }

  @ResolveField(() => CountryEntity)
  country(
    @Parent() studioCountry: StudioCountryEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.countryLoader.load(studioCountry.countryId);
  }
}
