// interceptors/metrics.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { httpRequestDurationSeconds } from 'src/metrics/metrics.registry';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const route = request.route ? request.route.path : request.url;

    const end = httpRequestDurationSeconds.startTimer({ method, route });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const code = response.statusCode;
        end({ code });
      }),
    );
  }
}
