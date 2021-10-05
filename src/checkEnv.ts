/* eslint-disable no-console */
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const envList: string[] = [
    'PORT_PRODUCTION', 'PORT_DEVELOPMENT', 'PORT_TEST',
    'DB_PRODUCTION_URL', 'DB_DEVELOPMENT_URL', 'DB_TEST_URL',
    'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_REGION', 'S3_BUCKET_NAME',
    'REDIS_URL', 'REDIS_PASSWORD',
    'BCRYPT_SALT',
    'COOKIE_SECRET',
    'NODEMAILER_USER', 'NODEMAILER_PASS',
    'FE_DEV_URL', 'FE_PROD_URL', 'FE_TEST_URL',
];

export default function checkEnv(): void {
    switch (process.env.NODE_ENV) {
        case 'production':
            process.env.PORT = process.env.PORT_PRODUCTION;
            process.env.DB_URL = process.env.DB_PRODUCTION_URL;
            process.env.FE_URL = process.env.FE_PROD_URL;
            break;
        case 'development':
            process.env.PORT = process.env.PORT_DEVELOPMENT;
            process.env.DB_URL = process.env.DB_DEVELOPMENT_URL;
            process.env.FE_URL = process.env.FE_DEV_URL;
            break;
        case 'test':
            process.env.PORT = process.env.PORT_TEST;
            process.env.DB_URL = process.env.DB_TEST_URL;
            process.env.FE_URL = process.env.FE_TEST_URL;
            break;
        default:
            console.log('NODE_ENV is not set. Use Default(development)...');
            process.env.NODE_ENV = 'development';
            process.env.PORT = process.env.PORT_DEVELOPMENT;
            process.env.DB_URL = process.env.DB_DEVELOPMENT_URL;
            process.env.FE_URL = process.env.FE_DEV_URL;
            break;
    }

    const URL: string = process.env.DB_URL as string;
    const version: string = process.env.npm_package_version as string;
    process.env.DB_URL = URL + version;
    const undefinedList: string[] = envList.filter((envVar: string) => process.env[envVar] === undefined || process.env[envVar] === '');

    if (undefinedList.length > 0) {
        console.log('\n------- Unset Env Variables -------\n');
        undefinedList.forEach((e: string) => console.log(`ENV(${chalk.bold.cyan(`${e}`)}) is not set...`));
        process.exit();
    }
}
