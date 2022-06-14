import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailResolver } from './email.resolver';
import { UserModule } from '../user/user.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    UserModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          secure: true,
          port: 465,
          authMethod: 'PLAIN',
          host: config.get('MAIL_HOST'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [
    MailingService,
    EmailConfirmationService,
    EmailResolver,
    EmailService,
  ],
  exports: [MailingService, EmailConfirmationService, EmailResolver],
})
export class EmailModule {}
