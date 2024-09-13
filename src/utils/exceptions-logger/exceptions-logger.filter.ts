import {
  ConnectionException,
  EntityManager,
  ForeignKeyConstraintViolationException,
  NotNullConstraintViolationException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { NotFoundError } from 'rxjs';

@Catch()
export class ExceptionsLoggerFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
    } else if (exception instanceof UniqueConstraintViolationException) {
      status = HttpStatus.CONFLICT;
      message = 'Unique constraint violation';
    } else if (exception instanceof NotNullConstraintViolationException) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Not null constraint violation';
    } else if (exception instanceof ConnectionException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Db connection failed';
    } else if (exception instanceof ForeignKeyConstraintViolationException) {
      (status = HttpStatus.BAD_REQUEST),
        (message = 'foreign key constraint violation');
    }

    const isProduction = this.configService.get('NODE_ENV') === 'production';

    if (!isProduction) {
      details = {
        exception:
          exception instanceof Error ? exception.name : 'Unknown error',
        stackTrace:
          exception instanceof Error
            ? exception.stack
            : 'No stack trace available',
      };
    }

    httpAdapter.reply(
      response,
      {
        statusCode: status,
        message: isProduction ? 'An error occurred' : message,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(isProduction ? {} : { details }),
      },
      status,
    );
  }
}
