import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../utils/errors/not-found.error';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  create = async (
    userId: string,
    expiresAt: Date,
  ): Promise<RefreshTokenEntity> =>
    this.refreshTokenRepository.save({
      userId,
      expiresAt,
    });

  readOne = async (id: string): Promise<RefreshTokenEntity> => {
    const token = await this.refreshTokenRepository.findOneBy({
      id,
    });
    if (!token) {
      throw new NotFoundError(`Refresh token with id "${id}" not found!`);
    }
    return token;
  };

  deleteExpired = async (): Promise<boolean> => {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
    return true;
  };

  delete = async (id: string): Promise<boolean> => {
    const token = await this.refreshTokenRepository.findOneBy({ id });
    if (!token) {
      throw new NotFoundError(`Refresh token with id "${id}" not found!`);
    }
    await this.refreshTokenRepository.remove(token);
    return true;
  };
}
