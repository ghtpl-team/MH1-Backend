import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ConnectionException,
  EntityManager,
  ForeignKeyConstraintViolationException,
  MetadataError,
  NotFoundError,
  NotNullConstraintViolationException,
  OptimisticLockError,
  UniqueConstraintViolationException,
  ValidationError,
} from '@mikro-orm/core';

@Catch()
export class ExceptionsLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsLoggerFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = {};

    const isProduction = this.configService.get('NODE_ENV') === 'production';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      if (!isProduction) {
        details = exception.getResponse();
      }
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
      if (!isProduction) {
        details = {
          message: exception.message,
          ...exception,
        };
      }
    } else if (exception instanceof UniqueConstraintViolationException) {
      status = HttpStatus.CONFLICT;
      message = 'Unique constraint violation';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (exception instanceof NotNullConstraintViolationException) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Not null constraint violation';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (exception instanceof ConnectionException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database connection failed';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (exception instanceof ForeignKeyConstraintViolationException) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Foreign key constraint violation';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (exception instanceof OptimisticLockError) {
      status = HttpStatus.CONFLICT;
      message = 'Optimistic lock error';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (exception instanceof MetadataError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Metadata error';
      if (!isProduction) {
        details = exception.message;
      }
    } else if (isMySqlError(exception)) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database error';
      if (!isProduction) {
        details = {
          code: exception.code,
          errno: exception.errno,
          sqlState: exception.sqlState,
          sqlMessage: exception.sqlMessage,
          sql: exception.sql,
        };
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      if (!isProduction) {
        details = {
          name: exception.name,
          message: exception.message,
          stack: exception.stack,
        };
      }
    } else {
      // Unknown exception type
      if (!isProduction) {
        details = {
          message: 'Unknown error',
          exception: exception,
        };
      }
    }

    // Log the exception details
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // Send the HTTP response
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

// Helper function and interface for MySQL errors
function isMySqlError(exception: any): exception is MySqlError {
  return (
    exception &&
    typeof exception === 'object' &&
    'code' in exception &&
    'sqlMessage' in exception
  );
}

interface MySqlError extends Error {
  code: string;
  errno: number;
  sqlState: string;
  sqlMessage: string;
  sql: string;
}
