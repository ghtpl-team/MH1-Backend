import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  timezone: string;
}

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage: AsyncLocalStorage<RequestContext>;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage<RequestContext>();
  }

  run(callback: (...args: any[]) => void, context: RequestContext) {
    this.asyncLocalStorage.run(context, callback);
  }

  getContext(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
