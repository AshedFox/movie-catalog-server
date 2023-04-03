import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailingService } from './services/mailing.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          secure: config.get<boolean>('MAIL_SECURE'),
          port: config.get<number>('MAIL_PORT'),
          authMethod: 'PLAIN',
          host: config.get<string>('MAIL_HOST'),
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
