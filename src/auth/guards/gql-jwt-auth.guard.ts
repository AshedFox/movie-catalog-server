import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
  private jwtService: JwtService;

  constructor(configService: ConfigService) {
    this.jwtService = new JwtService({
      secret: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: configService.getOrThrow('ACCESS_TOKEN_LIFETIME'),
      },
    });
  }

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided!');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; role: string }>(
        token,
      );
      request.user = { id: payload.sub, role: payload.role };
    } catch {
      throw new UnauthorizedException('Invalid token!');
    }

    return true;
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
