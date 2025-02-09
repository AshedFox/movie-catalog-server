import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    UserModule,
    JwtModule,
    StripeModule,
  ],
  providers: [AuthService, JwtAuthStrategy, RefreshTokenStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
