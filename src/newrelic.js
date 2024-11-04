exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
    filepath: 'stdout',
  },
  allow_all_headers: true,
  attributes: {
    custom_key: 'custom_value',
  },
  error_collector: {
    enabled: true,
  },
  transaction_tracer: {
    enabled: true,
  },
  application_logging: {
    forwarding: {
      enabled: true,
    },
  },
  browser_monitoring: {
    enable: true,
  },
};
