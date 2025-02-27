import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { StripeModule } from '../stripe/stripe.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, StripeModule],
  providers: [
    AuthService,
    AuthResolver,
    {
      provide: 'ACCESS_JWT_SERVICE',
      useFactory: (configService: ConfigService) =>
        new JwtService({
          secret: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('ACCESS_TOKEN_LIFETIME'),
          },
        }),
      inject: [ConfigService],
    },
    {
      provide: 'REFRESH_JWT_SERVICE',
      useFactory: (configService: ConfigService) =>
        new JwtService({
          secret: configService.getOrThrow('REFRESH_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('REFRESH_TOKEN_LIFETIME'),
          },
        }),
      inject: [ConfigService],
    },
    {
      provide: 'RESET_PASSWORD_JWT_SERVICE',
      useFactory: (configService: ConfigService) =>
        new JwtService({
          secret: configService.getOrThrow('RESET_PASSWORD_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow(
              'RESET_PASSWORD_TOKEN_LIFETIME',
            ),
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
