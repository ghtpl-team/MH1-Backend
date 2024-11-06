import 'dotenv/config';
import { Logger, LogLevel } from '@nestjs/common/services/logger.service';
import { readFileSync } from 'fs';
import { join } from 'path';

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

export function nthNumber(number: number) {
  if (number >= 4 && number <= 21) {
    return number + 'th';
  }

  switch (number % 10) {
    case 1:
      return number + 'st';
    case 2:
      return number + 'nd';
    case 3:
      return number + 'rd';
    default:
      return number + 'th';
  }
}

export function loadRootCAs(): Buffer[] {
  const logger = new Logger('LoadRootCAs');

  try {
    try {
      const localCerts = loadLocalCertificates();
      if (localCerts.length > 0) {
        logger.log('Loaded root CAs from local files');
        return localCerts;
      }
    } catch (error) {
      logger.warn(
        'Failed to load local certificates, falling back to download',
      );
    }
  } catch (error) {
    logger.error('Failed to load root CAs:', error);
    throw new Error('Failed to load Apple root CAs');
  }
}

function loadLocalCertificates(): Buffer[] {
  const certPaths = [
    join(__dirname, '../../../certs/AppleRootCA-G3.cer'),
    join(__dirname, '../../../certs/AppleRootCA-G2.cer'),
  ];

  return certPaths
    .map((path) => {
      try {
        return readFileSync(path);
      } catch {
        return null;
      }
    })
    .filter((cert): cert is Buffer => cert !== null);
}
