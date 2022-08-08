import { Injectable } from '@nestjs/common';
import { EmailConfirmationEntity } from '../entities/email-confirmation.entity';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../../utils/errors/not-found.error';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @InjectRepository(EmailConfirmationEntity)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationEntity>,
    private readonly configService: ConfigService,
  ) {}

  create = async (
    userId: string,
    email: string,
  ): Promise<EmailConfirmationEntity> =>
    this.emailConfirmationRepository.save({
      userId,
      email,
      expiredAt: new Date(
        Date.now() + ms(this.configService.get('EMAIL_CONFIRMATION_LIFETIME')),
      ),
    });

  readManyByIds = async (ids: string[]): Promise<EmailConfirmationEntity[]> =>
    await this.emailConfirmationRepository.findBy({ id: In(ids) });

  readOneById = async (id: string): Promise<EmailConfirmationEntity> => {
    const confirmation = await this.emailConfirmationRepository.findOneBy({
      id,
    });
    if (!confirmation) {
      throw new NotFoundError(`Email confirmation with id "${id}" not found!`);
    }
    return confirmation;
  };

  readOneNotExpiredByIdAndEmail = async (
    id: string,
    email: string,
  ): Promise<EmailConfirmationEntity> => {
    const confirmation = await this.emailConfirmationRepository.findOneBy({
      id,
      email,
      expiredAt: MoreThan(new Date()),
    });
    if (!confirmation) {
      throw new NotFoundError(`Email confirmation with id "${id}" not found!`);
    }
    return confirmation;
  };

  deleteExpired = async (): Promise<boolean> => {
    await this.emailConfirmationRepository.delete({
      expiredAt: LessThan(new Date()),
    });
    return true;
  };

  delete = async (id: string): Promise<boolean> => {
    const confirmation = await this.emailConfirmationRepository.findOneBy({
      id,
    });
    if (!confirmation) {
      throw new NotFoundError(`Email confirmation with id "${id}" not found!`);
    }
    await this.emailConfirmationRepository.remove(confirmation);
    return true;
  };
}
