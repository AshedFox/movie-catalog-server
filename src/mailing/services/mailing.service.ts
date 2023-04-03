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
      html: `
        <html lang='en'>
          <body>
            <p>Hello ${user.name}</p>
            <br/>
            <p>Welcome to MovieView,</p>
            <p>
                Click
                <b><a href="https://localhost:3001/confirm-email/${confirmationToken}">here</a></b>
                to confirm your account.
            </p>
            <br/>
            <p>Best of luck,</p>
            <p>MovieView Team</p>
          </body>
        </html>
      `,
    });
  };
}
