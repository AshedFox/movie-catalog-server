import {
  BadRequestException,
  Controller,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';
import { PurchaseService } from '../purchase/purchase.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { SubscriptionStatusEnum } from '@utils/enums/subscription-status.enum';

@Controller('/webhook')
export class WebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly purchaseService: PurchaseService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  async webhook(@Req() request: RawBodyRequest<Request>): Promise<void> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    const signature = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(
        request.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkout = event.data.object as Stripe.Checkout.Session;

        if (checkout.status === 'complete' && checkout.mode === 'payment') {
          const metadata = checkout.metadata;

          if (metadata.movieId && metadata.userId && metadata.priceId) {
            await this.purchaseService.create({
              userId: metadata.userId,
              movieId: metadata.movieId,
              priceId: metadata.priceId,
              madeAt: new Date(checkout.created * 1000),
            });
          }
        }

        break;
      }
      case 'customer.subscription.created': {
        console.log(event.data.object);
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.metadata.userId) {
          await this.subscriptionService.create({
            id: subscription.id,
            userId: subscription.metadata.userId,
            status: SubscriptionStatusEnum.IN_PROCESS,
            priceId: subscription.items.data[0].price.id,
            periodStart: new Date(subscription.current_period_start * 1000),
            periodEnd: new Date(subscription.current_period_end * 1000),
          });
        }

        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        await this.subscriptionService.update(invoice.subscription as string, {
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          status: SubscriptionStatusEnum.ACTIVE,
        });

        break;
      }
      case 'customer.subscription.updated': {
        console.log(event.data.object);

        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await this.subscriptionService.update(subscription.id, {
          status: SubscriptionStatusEnum.CANCELED,
        });

        break;
      }
    }
  }
}
