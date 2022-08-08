import { Module } from '@nestjs/common';
import { MailingService } from './services/mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationService } from './services/email-confirmation.service';
import { EmailResolver } from './email.resolver';
import { UserModule } from '../user/user.module';
import { EmailService } from './services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([EmailConfirmationEntity]),
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
  exports: [MailingService, EmailConfirmationService, EmailService],
})
export class EmailModule {}
