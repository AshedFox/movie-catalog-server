import { Module } from '@nestjs/common';
import { EmailConfirmationResolver } from './email-confirmation.resolver';
import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { JwtService } from '@nestjs/jwt';
import { MailingModule } from '../mailing/mailing.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, MailingModule],
  providers: [
    EmailConfirmationResolver,
    EmailConfirmationService,
    {
      provide: 'EMAIL_CONFIRMATION_JWT_SERVICE',
      useFactory: (configService: ConfigService) =>
        new JwtService({
          secret: configService.getOrThrow('CONFIRMATION_TOKEN_SECRET'),
          signOptions: {
            algorithm: 'HS512',
            expiresIn: configService.getOrThrow('CONFIRMATION_TOKEN_LIFETIME'),
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
