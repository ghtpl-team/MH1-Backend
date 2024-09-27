// metrics/http-request-duration.metric.ts
import { Histogram } from 'prom-client';

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 0.5, 1, 1.5, 2.5, 5, 10],
});
