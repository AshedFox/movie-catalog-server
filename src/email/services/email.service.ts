import { Injectable } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { MailingService } from './mailing.service';
import { UserService } from '../../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmationEntity } from '../entities/email-confirmation.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailConfirmationEntity)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationEntity>,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly mailingService: MailingService,
    private readonly userService: UserService,
  ) {}

  sendConfirmation = async (id: string, email: string): Promise<boolean> => {
    const confirmation = await this.emailConfirmationService.create(id, email);
    await this.mailingService.sendConfirmation(confirmation);
    return true;
  };

  confirmEmail = async (id: string, email: string): Promise<boolean> => {
    const confirmation =
      await this.emailConfirmationService.readOneNotExpiredByIdAndEmail(
        id,
        email,
      );
    await this.userService.setEmailConfirmed(confirmation.userId);
    return true;
  };
}
