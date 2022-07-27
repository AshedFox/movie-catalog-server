import { Injectable } from '@nestjs/common';
import { RefreshTokenModel } from './entities/refresh-token.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenModel)
    private readonly refreshTokenRepository: Repository<RefreshTokenModel>,
  ) {}

  async create(userId: string, expiresAt: Date): Promise<RefreshTokenModel> {
    return this.refreshTokenRepository.save({ userId, expiresAt });
  }

  async readOne(id: string): Promise<RefreshTokenModel> {
    const token = await this.refreshTokenRepository.findOneBy({
      id,
    });
    if (!token) {
      throw new NotFoundError();
    }
    return token;
  }

  async delete(id: string): Promise<boolean> {
    const token = await this.refreshTokenRepository.findOneBy({ id });
    if (!token) {
      throw new NotFoundError();
    }
    await this.refreshTokenRepository.remove(token);
    return true;
  }
}
