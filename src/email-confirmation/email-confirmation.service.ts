import { BadRequestException, Injectable } from '@nestjs/common';
import { MailingService } from '../mailing/services/mailing.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from '@utils/errors';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
    private readonly userService: UserService,
  ) {}

  sendConfirmation = async (userId: string): Promise<boolean> => {
    const user = await this.userService.readOneById(userId);

    if (!user) {
      throw new NotFoundError('User not found!');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed!');
    }

    const confirmationToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        algorithm: 'HS512',
        secret: this.configService.get<string>('CONFIRMATION_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'CONFIRMATION_TOKEN_LIFETIME',
        ),
      },
    );

    await this.mailingService.sendConfirmation(user, confirmationToken);
    return true;
  };

  confirmEmail = async (token: string): Promise<boolean> => {
    try {
      const { sub, email } = this.jwtService.verify<{
        sub: string;
        email: string;
      }>(token, {
        algorithms: ['HS512'],
        secret: this.configService.get<string>('CONFIRMATION_TOKEN_SECRET'),
      });

      await this.checkIfEmailChanged(sub, email);

      await this.userService.setEmailConfirmed(sub);
      return true;
    } catch (err) {
      throw new BadRequestException(err);
    }
  };

  private checkIfEmailChanged = async (userId: string, email: string) => {
    const user = await this.userService.readOneById(userId);

    if (user.email !== email) {
      throw new Error(
        'Confirmation email is not equals to current user email!',
      );
    }
  };
}
