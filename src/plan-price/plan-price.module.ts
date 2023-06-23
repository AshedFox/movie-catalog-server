import { Module } from '@nestjs/common';
import { PlanPriceService } from './plan-price.service';
import { PlanPriceResolver } from './plan-price.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanPriceEntity } from './entities/plan-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanPriceEntity])],
  providers: [PlanPriceResolver, PlanPriceService],
  exports: [PlanPriceService],
})
export class PlanPriceModule {}
