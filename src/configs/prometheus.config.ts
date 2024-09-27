import { PrometheusOptions } from '@willsoto/nestjs-prometheus';

export const PROMETHEUS_OPTIONS: PrometheusOptions = {
  defaultLabels: ['MH1'],
  defaultMetrics: {
    enabled: true,
  },
  path: 'api/metrics',
};
