import { Module } from '@nestjs/common';
import { PurchaseModule } from '../purchase/purchase.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WebhookController } from './webhook.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [PurchaseModule, SubscriptionModule, StripeModule],
  providers: [WebhookController],
  controllers: [WebhookController],
  exports: [],
})
export class WebhookModule {}
