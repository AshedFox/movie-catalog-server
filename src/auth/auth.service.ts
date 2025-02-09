import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import * as argon2 from 'argon2';
import { SignUpInput } from './dto/sign-up.input';
import { AuthResult } from './dto/auth.result';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';
import { LoginInput } from './dto/login.input';
import { AuthError, RefreshTokenError } from '@utils/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly stripeService: StripeService,
  ) {}


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

  makeAuthResult = async (user: UserEntity): Promise<AuthResult> => ({
    user,
    refreshToken: await this.generateRefreshToken(user),
    accessToken: await this.generateAccessToken(user),
  });

  login = async (loginInput: LoginInput): Promise<AuthResult> => {
    const user = await this.userService.readOneByEmail(loginInput.email);

    if (await argon2.verify(user.password, loginInput.password)) {
      user.password = '';
      return this.makeAuthResult(user);
    } else {
      throw new AuthError('User password incorrect!');
    }
  };

  signUp = async (signUpInput: SignUpInput): Promise<AuthResult> => {
    if (signUpInput.password !== signUpInput.passwordRepeat) {
      throw new AuthError('Password and password repetition are not equal!');
    }

    const customer = await this.stripeService.createCustomer(
      signUpInput.email,
      signUpInput.name,
    );

    const user = await this.userService.create({
      email: signUpInput.email,
      name: signUpInput.name,
      customerId: customer.id,
      password: await argon2.hash(signUpInput.password),
    });
    return this.makeAuthResult(user);
  };
}
