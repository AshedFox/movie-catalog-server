import { Module } from '@nestjs/common';
import { MailingService } from './services/mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailResolver } from './email.resolver';
import { UserModule } from '../user/user.module';
import { EmailService } from './services/email.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule,
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
  providers: [MailingService, EmailResolver, EmailService],
  exports: [MailingService, EmailService],
})
export class EmailModule {}
