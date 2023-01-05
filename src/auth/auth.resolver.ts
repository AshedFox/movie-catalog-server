import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthResult } from './dto/auth.result';
import { CreateUserInput } from '../user/dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { Request } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';

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
    @Context('req') request: Request,
  ) {
    const result = await this.authService.login(user);
    request.res.cookie('X-REFRESH-TOKEN', result.refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('REFRESH_TOKEN_LIFETIME')),
    });
    request.res.cookie('X-ACCESS-TOKEN', result.accessToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('ACCESS_TOKEN_LIFETIME')),
    });
    return result;
  }

  @Mutation(() => AuthResult)
  async register(
    @Args('input') registerInput: CreateUserInput,
    @Context('req') request: Request,
  ) {
    const result = await this.authService.register(registerInput);
    request.res.cookie('X-REFRESH-TOKEN', result.refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('REFRESH_TOKEN_LIFETIME')),
    });
    request.res.cookie('X-ACCESS-TOKEN', result.accessToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('ACCESS_TOKEN_LIFETIME')),
    });
    return result;
  }

  @Mutation(() => AuthResult)
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @CurrentUser() user: UserEntity,
    @Context('req') request: Request,
  ) {
    const result = await this.authService.login(user);
    request.res.cookie('X-REFRESH-TOKEN', result.refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('REFRESH_TOKEN_LIFETIME')),
    });
    request.res.cookie('X-ACCESS-TOKEN', result.accessToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'none',
      maxAge: ms(this.configService.get<string>('ACCESS_TOKEN_LIFETIME')),
    });
    return result;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard, RefreshTokenGuard)
  logout(@Context('req') request: Request) {
    request.res.clearCookie('X-ACCESS-TOKEN');
    request.res.clearCookie('X-REFRESH-TOKEN');
    return true;
  }
}
