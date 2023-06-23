import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity } from './entities/price.entity';
import { PriceService } from './price.service';
import { StripeModule } from '../stripe/stripe.module';
import { PriceResolver } from './price.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([PriceEntity]),
    forwardRef(() => StripeModule),
  ],
  providers: [PriceService, PriceResolver],
  exports: [PriceService],
})
export class PriceModule {}
