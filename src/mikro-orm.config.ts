import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { MySqlDriver } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import 'dotenv/config';

const config: Options = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  driver: MySqlDriver,
  entities: ['./dist/*.entities.js'],
  entitiesTs: ['./src/*.entities.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  extensions: [Migrator],
};

export default config;
