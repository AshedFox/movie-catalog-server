import {
  Args,
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
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => StudioCountryEntity)
export class StudioCountryResolver {
  constructor(private readonly studioCountryService: StudioCountryService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioCountryEntity)
  createStudioCountry(
    @Args('studioId', { type: () => Int }) studioId: number,
    @Args('countryId') countryId: string,
  ) {
    return this.studioCountryService.create(studioId, countryId);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioCountryEntity)
  deleteStudioCountry(
    @Args('studioId', { type: () => Int }) studioId: number,
    @Args('countryId') countryId: string,
  ) {
    return this.studioCountryService.delete(studioId, countryId);
  }

  @ResolveField(() => StudioEntity)
  studio(
    @Parent() studioCountry: StudioCountryEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(StudioEntity, 'id')
      .load(studioCountry.studioId);
  }

  @ResolveField(() => CountryEntity)
  country(
    @Parent() studioCountry: StudioCountryEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(CountryEntity, 'id')
      .load(studioCountry.countryId);
  }
}
