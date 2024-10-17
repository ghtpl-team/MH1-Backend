import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { RequestContextService } from 'src/common/request-context/request-context.service';

import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestContextMiddleware.name);

  constructor(private readonly requestContextService: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tzHeader = req.headers['x-mh-timezone'] as string;

    const timezoneToUse = tzHeader || 'Asia/Kolkata'; // Default to UTC if not provided

    try {
      if (!dayjs.tz(new Date(), timezoneToUse).isValid()) {
        throw new BadRequestException(`Invalid timezone: ${timezoneToUse}`);
      }
    } catch (error) {
      throw new BadRequestException(`Invalid timezone: ${timezoneToUse}`);
    }

    this.logger.debug({
      path: req.path,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      timezone: timezoneToUse,
    });

    this.requestContextService.run(
      () => {
        next();
      },
      { timezone: timezoneToUse },
    );
  }
}
