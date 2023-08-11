import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { AuthResolver } from './auth.resolver';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    PassportModule,
    JwtModule,
    StripeModule,
  ],
  providers: [AuthService, JwtAuthStrategy, RefreshTokenStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
