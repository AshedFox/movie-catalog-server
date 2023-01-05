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
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(() => CountryEntity)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => CountryEntity)
  createCountry(@Args('input') input: CreateCountryInput) {
    return this.countryService.create(input);
  }

  @Query(() => PaginatedCountries)
  getCountries(@Args() { sort, filter, pagination }: GetCountriesArgs) {
    return this.countryService.readMany(pagination, sort, filter);
  }

  @Query(() => CountryEntity)
  getCountry(@Args('id') id: string) {
    return this.countryService.readOne(id);
  }

  @Mutation(() => CountryEntity)
  updateCountry(
    @Args('id') id: string,
    @Args('input') input: UpdateCountryInput,
  ) {
    return this.countryService.update(id, input);
  }

  @Mutation(() => Boolean)
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
}
