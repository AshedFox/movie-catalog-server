import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { SubscriptionService } from './subscription.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionResolver } from './subscription.resolver';
import { SubscriptionEntity } from './entities/subscription.entity';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    StripeModule,
    UserModule,
    PriceModule,
  ],
  providers: [SubscriptionService, SubscriptionResolver],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
