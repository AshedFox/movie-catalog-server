import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanResolver } from './plan.resolver';
import { PlanService } from './plan.service';
import { StripeModule } from '../stripe/stripe.module';
import { PriceModule } from '../price/price.module';
import { PlanPriceModule } from '../plan-price/plan-price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity]),
    StripeModule,
    PriceModule,
    PlanPriceModule,
  ],
  providers: [PlanResolver, PlanService],
  exports: [PlanService],
})
export class PlanModule {}
