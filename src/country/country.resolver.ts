import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CountryService } from './country.service';
import { CountryEntity } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { GetCountriesArgs } from './dto/get-countries.args';
import { PaginatedCountries } from './dto/paginated-countries';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { LanguageEntity } from '../language/entities/language.entity';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => CountryEntity)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => CountryEntity)
  createCountry(@Args('input') input: CreateCountryInput) {
    return this.countryService.create(input);
  }

  @Query(() => PaginatedCountries)
  async getCountries(
    @Args() { sort, filter, ...pagination }: GetCountriesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.countryService.readMany(pagination, sort, filter),
      this.countryService.count(filter),
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

  @Query(() => CountryEntity)
  getCountry(@Args('id') id: string) {
    return this.countryService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => CountryEntity)
  updateCountry(
    @Args('id') id: string,
    @Args('input') input: UpdateCountryInput,
  ) {
    return this.countryService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => CountryEntity)
  deleteCountry(@Args('id') id: string) {
    return this.countryService.delete(id);
  }

  @ResolveField(() => CurrencyEntity)
  currency(
    @Parent() country: CountryEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(CurrencyEntity, 'id')
      .load(country.currencyId);
  }

  @ResolveField(() => LanguageEntity)
  language(
    @Parent() country: CountryEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(LanguageEntity, 'id')
      .load(country.languageId);
  }
}
