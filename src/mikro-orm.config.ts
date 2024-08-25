import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    dbName: 'mh1_database',
    driver: PostgreSqlDriver,
    entities: ['./dist/*.entities.js'],
    entitiesTs: ['./src/*.entities.ts'],
    metadataProvider: TsMorphMetadataProvider,
    debug: true,
    extensions: [Migrator]
    
}

export default config;