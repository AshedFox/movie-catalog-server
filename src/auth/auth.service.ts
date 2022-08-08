import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import * as argon2 from 'argon2';
import { RegisterInput } from './dto/register.input';
import { AuthResult } from './dto/auth.result';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  validateUser = async (
    username: string,
    password: string,
  ): Promise<UserEntity> => {
    const user = await this.userService.readOneByEmail(username);
    if (user && (await argon2.verify(user.password, password))) {
      user.password = '';
      return user;
    }
    return null;
  };

  validateRefreshToken = async (token: string): Promise<UserEntity> => {
    const oldRefreshToken = await this.refreshTokenService.readOne(token);
    const result =
      oldRefreshToken.expiresAt > new Date()
        ? await this.userService.readOneById(oldRefreshToken.userId)
        : null;
    await this.refreshTokenService.delete(oldRefreshToken.id);
    return result;
  };

  generateRefreshToken = async (user: UserEntity): Promise<string> => {
    const refreshToken = await this.refreshTokenService.create(
      user.id,
      new Date(
        Date.now() + ms(this.configService.get('REFRESH_TOKEN_LIFETIME')),
      ),
    );
    return this.jwtService.sign(
      { sub: refreshToken.id },
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_LIFETIME'),
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );
  };

  generateAccessToken = async (user: UserEntity): Promise<string> =>
    this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFETIME'),
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

  login = async (user: UserEntity): Promise<AuthResult> => ({
    refreshToken: await this.generateRefreshToken(user),
    accessToken: await this.generateAccessToken(user),
  });

  register = async (registerInput: RegisterInput): Promise<AuthResult> => {
    const user = await this.userService.create({
      ...registerInput,
      password: await argon2.hash(registerInput.password),
    });
    return this.login(user);
  };
}
