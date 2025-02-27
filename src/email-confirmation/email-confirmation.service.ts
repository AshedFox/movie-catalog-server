import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MailingService } from '../mailing/services/mailing.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from '@utils/errors';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('EMAIL_CONFIRMATION_JWT_SERVICE')
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

    const confirmationToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    await this.mailingService.sendConfirmation(user, confirmationToken);
    return true;
  };

  confirmEmail = async (token: string): Promise<boolean> => {
    try {
      const { sub, email } = this.jwtService.verify<{
        sub: string;
        email: string;
      }>(token);

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
      throw new BadRequestException(
        'Confirmation email is not equals to current user email!',
      );
    }
  };
}
