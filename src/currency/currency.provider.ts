import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetCurrenciesArgs } from './dto/get-currencies.args';
import { CurrencyEntity } from './entities/currency.entity';
import { CreateCurrencyInput } from './dto/create-currency.input';
import { CurrencyService } from './currency.service';
import { UpdateCurrencyInput } from './dto/update-currency.input';
import { PaginatedCurrencies } from './dto/paginated-currencies';

@Resolver(CurrencyEntity)
export class CurrencyResolver {
  constructor(private readonly currencyService: CurrencyService) {}

  @Mutation(() => CurrencyEntity)
  createCurrency(@Args('input') input: CreateCurrencyInput) {
    return this.currencyService.create(input);
  }

  @Query(() => PaginatedCurrencies)
  getCurrencies(@Args() { sort, filter, pagination }: GetCurrenciesArgs) {
    return this.currencyService.readMany(pagination, sort, filter);
  }

  @Query(() => CurrencyEntity)
  getCurrency(@Args('id', { type: () => Int }) id: number) {
    return this.currencyService.readOne(id);
  }

  @Mutation(() => CurrencyEntity)
  updateCurrency(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCurrencyInput,
  ) {
    return this.currencyService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteCurrency(@Args('id', { type: () => Int }) id: number) {
    return this.currencyService.delete(id);
  }
}
