import { Module } from '@nestjs/common';
import { EmailConfirmationResolver } from './email-confirmation.resolver';
import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { JwtModule } from '@nestjs/jwt';
import { MailingModule } from '../mailing/mailing.module';

@Module({
  imports: [UserModule, JwtModule, MailingModule],
  providers: [EmailConfirmationResolver, EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
