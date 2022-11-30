import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { refreshTokenExtractor } from '../cookie.extractor';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

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
      jwtFromRequest: ExtractJwt.fromExtractors([refreshTokenExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.validateRefreshToken(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
