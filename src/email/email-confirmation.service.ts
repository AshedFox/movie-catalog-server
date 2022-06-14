import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from './entities/email-confirmation.model';
import { LessThan, MoreThan } from 'typeorm';

@Injectable()
export class EmailConfirmationService {
  async create(userId: string, email: string): Promise<EmailConfirmationModel> {
    const now = new Date();

    return EmailConfirmationModel.create({
      userId,
      email,
      expiredAt: new Date(now.setDate(now.getDate() + 1)),
    });
  }

  async readOneById(id: string) {
    return EmailConfirmationModel.findOne(id);
  }

  async readOneNotExpiredByIdAndEmail(id: string, email: string) {
    return EmailConfirmationModel.findOne({
      id,
      email,
      expiredAt: MoreThan(new Date()),
    });
  }

  async deleteExpired() {
    return !!(await EmailConfirmationModel.delete({
      expiredAt: LessThan(new Date()),
    }));
  }

  async delete(id: string) {
    return !!(await EmailConfirmationModel.delete(id));
  }
}
