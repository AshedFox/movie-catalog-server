import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PlanPriceEntity } from './entities/plan-price.entity';
import { PlanEntity } from '../plan/entities/plan.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { PriceEntity } from '../price/entities/price.entity';
import { PlanPriceService } from './plan-price.service';

@Resolver(() => PlanPriceEntity)
export class PlanPriceResolver {
  constructor(private readonly planPriceService: PlanPriceService) {}

  @Mutation(() => PlanPriceEntity)
  createPlanPrice(
    @Args('planId') planId: string,
    @Args('priceId') priceId: string,
  ) {
    return this.planPriceService.create(planId, priceId);
  }

  @Query(() => PlanPriceEntity)
  getPlanPrice(
    @Args('planId') planId: string,
    @Args('priceId') priceId: string,
  ) {
    return this.planPriceService.readOne(priceId, planId);
  }

  @ResolveField(() => PlanEntity)
  plan(
    @Root() planPrice: PlanPriceEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(PlanEntity, 'id')
      .load(planPrice.planId);
  }

  @ResolveField(() => PriceEntity)
  price(
    @Root() planPrice: PlanPriceEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(PriceEntity, 'id')
      .load(planPrice.priceId);
  }
}
