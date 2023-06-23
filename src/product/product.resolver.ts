import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { CreateProductInput } from './dto/create-product.input';
import { PriceEntity } from '../price/entities/price.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { ProductPriceEntity } from '../product-price/entities/product-price.entity';
import { MovieEntity } from '../movie/entities/movie.entity';

@Resolver(ProductEntity)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => ProductEntity)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create(input);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => ProductEntity)
  getProduct(@Args('id') id: string) {
    return this.productService.readOne(id);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Root() product: ProductEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(product.movieId);
  }

  @ResolveField(() => [PriceEntity])
  prices(
    @Root() product: ProductEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(
        ProductPriceEntity,
        'productId',
        ProductEntity,
        'id',
        'price',
        PriceEntity,
      )
      .load({ id: product.id });
  }
}
