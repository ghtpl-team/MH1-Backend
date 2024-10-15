import 'dotenv/config';
import { LogLevel } from '@nestjs/common/services/logger.service';

export function getImageUrl(str: string, fromStrapi: boolean = true) {
  const baseUrl = fromStrapi
    ? process.env.STRAPI_BASE_URL
    : process.env.MEDIA_SERVER_BASE_URL;
  return str ? `${baseUrl}${str}` : null;
}

export function generateId(length: number = 12) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}
