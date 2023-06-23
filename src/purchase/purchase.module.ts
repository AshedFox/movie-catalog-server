import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { StripeModule } from '../stripe/stripe.module';
import { UserModule } from '../user/user.module';
import { PurchaseService } from './purchase.service';
import { PurchaseResolver } from './purchase.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseEntity]),
    StripeModule,
    UserModule,
  ],
  providers: [PurchaseService, PurchaseResolver],
  exports: [PurchaseService],
})
export class PurchaseModule {}
