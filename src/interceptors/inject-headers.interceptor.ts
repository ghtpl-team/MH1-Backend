import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInjectorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.user && request.user.id) {
      request.headers['x-mh-v3-user-id'] = request.user.id;
    } else {
      console.warn('User or User ID is not available on the request object');
    }

    return next.handle();
  }
}
