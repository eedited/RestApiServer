import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface databaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
    logging: boolean;
}

export const production: databaseConfig = {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_DBNAME || 'typescript_test',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_PORT as Dialect || 'mysql',
    logging: false,
};
export const development: databaseConfig = {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_DBNAME || 'typescript_test',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_PORT as Dialect || 'mysql',
    logging: false,
};
export const test: databaseConfig = {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_DBNAME || 'typescript_test',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_PORT as Dialect || 'mysql',
    logging: false,
};
