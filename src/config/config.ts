import { Dialect } from 'sequelize';

export interface databaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: string;
    dialect: Dialect;
    logging: boolean;
}

export interface ProdDevTest {
    production: databaseConfig;
    development: databaseConfig;
    test: databaseConfig;
}

export type ProdDevTestLiteral = 'production' | 'development' | 'test'

export const config: ProdDevTest = {
    production: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DBNAME || 'typescript_test',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        dialect: 'mysql',
        logging: false,
    },
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '123',
        database: process.env.DB_DBNAME || 'node-boiler-plate__dev',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        dialect: 'mysql',
        logging: false,
    },
    test: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DBNAME || 'typescript_test',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        dialect: 'mysql',
        logging: false,
    },
};
