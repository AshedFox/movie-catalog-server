import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CountryService } from './country.service';
import { CountryModel } from './entities/country.model';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';

@Resolver(() => CountryModel)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => CountryModel)
  createCountry(@Args('input') input: CreateCountryInput) {
    return this.countryService.create(input);
  }

  @Query(() => [CountryModel])
  getCountries() {
    return this.countryService.readAll();
  }

  @Query(() => CountryModel)
  getCountry(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.readOne(id);
  }

  @Mutation(() => CountryModel)
  updateCountry(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCountryInput,
  ) {
    return this.countryService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeCountry(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.delete(id);
  }
}
