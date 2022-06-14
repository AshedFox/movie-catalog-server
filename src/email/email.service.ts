import { Injectable } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { MailingService } from './mailing.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly mailingService: MailingService,
    private readonly userService: UserService,
  ) {}

  async sendConfirmation(id: string, email: string): Promise<boolean> {
    const confirmation = await this.emailConfirmationService.create(id, email);
    await confirmation.save();
    await this.mailingService.sendConfirmation(confirmation);
    return true;
  }

  async confirmEmail(id: string, email: string): Promise<boolean> {
    const confirmation =
      await this.emailConfirmationService.readOneNotExpiredByIdAndEmail(
        id,
        email,
      );

    if (confirmation) {
      await this.userService.setEmailConfirmed(confirmation.userId);
      return true;
    }
    return false;
  }
}
