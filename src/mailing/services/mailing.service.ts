import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

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
        addressBase: this.configService.get<string>('CLIENT_URL'),
      },
    });
  };
}
