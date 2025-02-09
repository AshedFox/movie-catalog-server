import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { AlreadyExistsError } from '@utils/errors';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private refreshLifetime: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ACCESS_JWT_SERVICE')
    private readonly accessJwtService: JwtService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwtService: JwtService,
    @InjectRedis()
    private readonly redis: Redis,
    private readonly userService: UserService,
    private readonly stripeService: StripeService,
  ) {
    this.refreshLifetime = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_LIFETIME',
    );
  }

  private generateRefreshToken = async (user: UserEntity): Promise<string> => {
    const token = await this.refreshJwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    await this.redis.set(
      `refresh:${user.id}:${token}`,
      token,
      'EX',
      ms(this.refreshLifetime),
    );

    return token;
  };

  private generateAccessToken = async (user: UserEntity): Promise<string> =>
    this.accessJwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

  private makeAuthResult = async (user: UserEntity): Promise<AuthResult> => ({
    user,
    refreshToken: await this.generateRefreshToken(user),
    accessToken: await this.generateAccessToken(user),
  });

  login = async (loginInput: LoginInput): Promise<AuthResult> => {
    const user = await this.userService.readOneByEmail(loginInput.email);

    if (await argon2.verify(user.password, loginInput.password)) {
      return this.makeAuthResult(user);
    } else {
      throw new UnauthorizedException('User password incorrect!');
    }
  };

  signUp = async (signUpInput: SignUpInput): Promise<AuthResult> => {
    if (signUpInput.password !== signUpInput.passwordRepeat) {
      throw new BadRequestException(
        'Password and password repetition are not equal!',
      );
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
  };

  refresh = async (
    userId: string,
    refreshToken: string,
  ): Promise<AuthResult> => {
    const payload = this.refreshJwtService.verify<{ sub: string }>(
      refreshToken,
    );
    const storedToken = await this.redis.get(
      `refresh:${userId}:${refreshToken}`,
    );

    if (!storedToken || userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token!');
    }

    await this.redis.del(`refresh:${userId}:${refreshToken}`);

    const user = await this.userService.readOneById(userId);

    return this.makeAuthResult(user);
  };

  logout = async (userId: string, refreshToken: string): Promise<void> => {
    await this.redis.del(`refresh:${userId}:${refreshToken}`);
  };
}
