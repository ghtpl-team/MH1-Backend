import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { RequestContextService } from 'src/common/request-context/request-context.service';

import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
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

    this.requestContextService.run(
      () => {
        next();
      },
      { timezone: timezoneToUse },
    );
  }
}
