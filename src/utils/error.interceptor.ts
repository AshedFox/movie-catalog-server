import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import {
  AlreadyExistsError,
  AuthError,
  NotFoundError,
  RefreshTokenError,
} from '@utils/errors';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof NotFoundError) {
          return throwError(() => new NotFoundException(err.message));
        } else if (err instanceof AlreadyExistsError) {
          return throwError(() => new ConflictException(err.message));
        } else if (err instanceof AuthError) {
          return throwError(() => new UnauthorizedException(err.message));
        } else if (err instanceof RefreshTokenError) {
          return throwError(() => new UnauthorizedException(err.message));
        } else if (err instanceof HttpException) {
          return throwError(() => err);
        }
        Logger.error(err.stack);
        return throwError(() => new InternalServerErrorException());
      }),
    );
  }
}
