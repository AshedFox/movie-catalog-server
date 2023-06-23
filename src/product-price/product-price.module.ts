import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPriceEntity } from './entities/product-price.entity';
import { ProductPriceService } from './product-price.service';
import { ProductPriceResolver } from './product-price.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPriceEntity])],
  providers: [ProductPriceService, ProductPriceResolver],
  exports: [ProductPriceService],
})
export class ProductPriceModule {}
