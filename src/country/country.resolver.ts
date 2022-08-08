import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CountryService } from './country.service';
import { CountryEntity } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';

@Resolver(() => CountryEntity)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => CountryEntity)
  createCountry(@Args('input') input: CreateCountryInput) {
    return this.countryService.create(input);
  }

  @Query(() => [CountryEntity])
  getCountries() {
    return this.countryService.readMany();
  }

  @Query(() => CountryEntity)
  getCountry(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.readOne(id);
  }

  @Mutation(() => CountryEntity)
  updateCountry(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCountryInput,
  ) {
    return this.countryService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteCountry(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.delete(id);
  }
}
