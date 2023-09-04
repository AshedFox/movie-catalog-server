import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { RefreshTokenError } from '@utils/errors';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['HS512'],
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  authenticate(req: Request, options?: any): void {
    try {
      super.authenticate(req, options);
    } catch (err) {
      throw new RefreshTokenError(err.message);
    }
  }

  async validate(payload: any) {
    return this.authService.validateRefreshToken(payload.sub);
  }
}
