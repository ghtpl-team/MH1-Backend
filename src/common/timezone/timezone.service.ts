import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../request-context/request-context.service';

@Injectable()
export class TimezoneService {
  constructor(private readonly requestContextService: RequestContextService) {}

  getTimezone(): string {
    const context = this.requestContextService.getContext();
    return context?.timezone || 'UTC';
  }
}
