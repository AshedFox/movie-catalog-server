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
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly stripeService: StripeService,
  ) {}

  validateUser = async (
    username: string,
    password: string,
  ): Promise<UserEntity> => {
    const user = await this.userService.readOneByEmail(username);

    if (await argon2.verify(user.password, password)) {
      user.password = '';
      return user;
    } else {
      throw new Error('User password incorrect!');
    }
  };

  validateRefreshToken = async (token: string): Promise<UserEntity> => {
    const oldRefreshToken = await this.refreshTokenService.readOne(token);

    if (oldRefreshToken.expiresAt <= new Date()) {
      throw new Error('Refresh token is expired!');
    }

    const user = await this.userService.readOneById(oldRefreshToken.userId);
    await this.refreshTokenService.delete(oldRefreshToken.id);
    return user;
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
        algorithm: 'HS512',
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
        algorithm: 'HS512',
        expiresIn: this.configService.get('ACCESS_TOKEN_LIFETIME'),
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

  login = async (user: UserEntity): Promise<AuthResult> => ({
    user,
    refreshToken: await this.generateRefreshToken(user),
    accessToken: await this.generateAccessToken(user),
  });

  register = async (registerInput: RegisterInput): Promise<AuthResult> => {
    if (registerInput.password !== registerInput.passwordRepeat) {
      throw new Error('Password and password repetition are not equal!');
    }

    const customer = await this.stripeService.createCustomer(
      registerInput.email,
      registerInput.name,
    );

    const user = await this.userService.create({
      email: registerInput.email,
      name: registerInput.name,
      customerId: customer.id,
      password: await argon2.hash(registerInput.password),
    });
    return this.login(user);
  };
}
