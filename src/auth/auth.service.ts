import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/entities/user.model';
import * as argon2 from 'argon2';
import { RegisterInput } from './dto/register.input';
import { AuthResult } from './dto/auth.result';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserModel> {
    const user = await this.userService.readOneByEmail(username);
    if (user && (await argon2.verify(user.password, password))) {
      user.password = '';
      return user;
    }
    return null;
  }

  async validateRefreshToken(token: string): Promise<UserModel> {
    const oldRefreshToken = await this.refreshTokenService.readOne(token);
    const result =
      oldRefreshToken.expiresAt > new Date()
        ? await this.userService.readOneById(oldRefreshToken.userId)
        : null;
    await this.refreshTokenService.delete(oldRefreshToken.id);
    return result;
  }

  async generateRefreshToken(user: UserModel): Promise<string> {
    const refreshToken = await this.refreshTokenService.create(
      user.id,
      new Date(Date.now() + ms(process.env.REFRESH_TOKEN_LIFETIME)),
    );
    return this.jwtService.sign(
      { sub: refreshToken.id },
      {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );
  }

  async generateAccessToken(user: UserModel): Promise<string> {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );
  }

  async login(user: UserModel): Promise<AuthResult> {
    return {
      refreshToken: await this.generateRefreshToken(user),
      accessToken: await this.generateAccessToken(user),
    };
  }

  async register(registerInput: RegisterInput): Promise<AuthResult> {
    const user = await this.userService.create({
      ...registerInput,
      password: await argon2.hash(registerInput.password),
    });
    return this.login(user);
  }
}
