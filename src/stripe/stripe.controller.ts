import { Controller, Get, Query } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Controller('/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('/get-checkout-session')
  getCheckoutSession(
    @Query('session_id') id: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripeService.getCheckoutSession(id);
  }
}
