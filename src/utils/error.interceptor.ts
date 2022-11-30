import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof NotFoundError) {
          return throwError(() => new NotFoundException(err.message));
        } else if (err instanceof AlreadyExistsError) {
          return throwError(() => new ConflictException(err.message));
        } else if (err instanceof HttpException) {
          return throwError(() => err);
        }
        console.log(err.stack);
        return throwError(() => new InternalServerErrorException());
      }),
    );
  }
}
