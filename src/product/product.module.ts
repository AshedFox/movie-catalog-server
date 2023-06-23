import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { StripeModule } from '../stripe/stripe.module';
import { MovieModule } from '../movie/movie.module';
import { PriceModule } from '../price/price.module';
import { ProductPriceModule } from '../product-price/product-price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    StripeModule,
    MovieModule,
    PriceModule,
    ProductPriceModule,
  ],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
