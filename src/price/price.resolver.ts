import { Args, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { PriceEntity } from './entities/price.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { PriceService } from './price.service';
import { CreatePriceInput } from './dto/create-price.input';

@Resolver(PriceEntity)
export class PriceResolver {
  constructor(private readonly priceService: PriceService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => PriceEntity)
  createPrice(@Args('input') input: CreatePriceInput) {
    return this.priceService.create(input);
  }

  @ResolveField(() => CurrencyEntity)
  currency(
    @Root() price: PriceEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(CurrencyEntity, 'id')
      .load(price.currencyId);
  }
}
