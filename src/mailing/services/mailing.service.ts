import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class MailingService {
  private addressBase: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.addressBase = this.configService.getOrThrow<string>('CLIENT_URL');
  }

  sendPasswordReset = async (email: string, token: string) => {
    await this.mailerService.sendMail({
      encoding: 'utf8',
      to: email,
      from: this.configService.get<string>('MAIL_USER'),
      subject: 'Password reset',
      template: 'password-reset',
      context: {
        token,
        addressBase: this.addressBase,
      },
    });
  };

  sendConfirmation = async (user: UserEntity, confirmationToken: string) => {
    await this.mailerService.sendMail({
      encoding: 'utf8',
      to: user.email,
      from: this.configService.get<string>('MAIL_USER'),
      subject: 'Confirm your email!',
      template: 'confirmation',
      context: {
        user,
        confirmationToken,
        addressBase: this.addressBase,
      },
    });
  };
}
