import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthResult } from './dto/auth.result';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { CurrentUserDto } from '../user/dto/current-user.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => AuthResult)
  @UseGuards(GqlLocalAuthGuard)
  async login(
    @Args('input') loginInput: LoginInput,
    @CurrentUser() user: UserEntity,
    @Context('res') res: Response,
  ) {
    const result = await this.authService.login(user);

    this.saveRefreshCookie(res, result.refreshToken);

    return result;
  }

  @Mutation(() => AuthResult)
  async register(
    @Args('input') registerInput: RegisterInput,
    @Context('res') res: Response,
  ) {
    const result = await this.authService.register(registerInput);

    this.saveRefreshCookie(res, result.refreshToken);

    return result;
  }

  @Mutation(() => AuthResult)
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @CurrentUser() user: UserEntity,
    @Context('res') res: Response,
  ) {
    const result = await this.authService.login(user);

    this.saveRefreshCookie(res, result.refreshToken);

    return result;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard, RefreshTokenGuard)
  async logout(
    @CurrentUser() user: CurrentUserDto,
    @Context('req') req: Request,
    @Context('res') res: Response,
  ) {
    res.clearCookie(this.configService.get<string>('REFRESH_COOKIE_NAME'), {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
    });

    return true;
  }

  private saveRefreshCookie(res: Response, value: string) {
    res.cookie(this.configService.get<string>('REFRESH_COOKIE_NAME'), value, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('REFRESH_TOKEN_LIFETIME')),
    });
  }
}
