import {
  Args,
  Context,
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
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

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
  async getCountries(@Args() { sort, filter, pagination }: GetCountriesArgs) {
    const [data, count] = await Promise.all([
      this.countryService.readMany(pagination, sort, filter),
      this.countryService.count(filter),
    ]);

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
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
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.currencyLoader.load(country.currencyId);
  }

  @ResolveField(() => LanguageEntity)
  language(
    @Parent() country: CountryEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.languageLoader.load(country.languageId);
  }
}
