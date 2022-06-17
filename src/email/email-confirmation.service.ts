import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from './entities/email-confirmation.model';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @InjectRepository(EmailConfirmationModel)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationModel>,
  ) {}

  async create(userId: string, email: string): Promise<EmailConfirmationModel> {
    const now = new Date();
    return this.emailConfirmationRepository.save({
      userId,
      email,
      expiredAt: new Date(now.setDate(now.getDate() + 1)),
    });
  }

  async readAllByIds(ids: string[]): Promise<EmailConfirmationModel[]> {
    return await this.emailConfirmationRepository.findByIds(ids);
  }

  async readOneById(id: string): Promise<EmailConfirmationModel> {
    const confirmation = await this.emailConfirmationRepository.findOne(id);
    if (!confirmation) {
      throw new NotFoundError();
    }
    return confirmation;
  }

  async readOneNotExpiredByIdAndEmail(
    id: string,
    email: string,
  ): Promise<EmailConfirmationModel> {
    const confirmation = await this.emailConfirmationRepository.findOne({
      id,
      email,
      expiredAt: MoreThan(new Date()),
    });
    if (!confirmation) {
      throw new NotFoundError();
    }
    return confirmation;
  }

  async deleteExpired(): Promise<boolean> {
    await this.emailConfirmationRepository.delete({
      expiredAt: LessThan(new Date()),
    });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const confirmation = await this.emailConfirmationRepository.findOne(id);
    if (!confirmation) {
      throw new NotFoundError();
    }
    await this.emailConfirmationRepository.remove(confirmation);
    return true;
  }
}
