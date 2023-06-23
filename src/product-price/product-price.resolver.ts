import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { ProductPriceEntity } from './entities/product-price.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { PriceEntity } from '../price/entities/price.entity';
import { ProductPriceService } from './product-price.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

@Resolver(ProductPriceEntity)
export class ProductPriceResolver {
  constructor(private readonly productPriceService: ProductPriceService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => ProductPriceEntity)
  createProductPrice(
    @Args('productId') productId: string,
    @Args('priceId') priceId: string,
  ) {
    return this.productPriceService.create(productId, priceId);
  }

  @Query(() => ProductPriceEntity)
  getProductPrice(
    @Args('productId') productId: string,
    @Args('priceId') priceId: string,
  ) {
    return this.productPriceService.readOne(priceId, productId);
  }

  @ResolveField(() => ProductEntity)
  product(
    @Root() productPrice: ProductPriceEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(ProductEntity, 'id')
      .load(productPrice.productId);
  }

  @ResolveField(() => PriceEntity)
  price(
    @Root() productPrice: ProductPriceEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(PriceEntity, 'id')
      .load(productPrice.priceId);
  }
}
