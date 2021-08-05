import { exec } from 'child_process';
require('dotenv').config();

switch (process.env.NODE_ENV) {
    case 'production':
        process.env.DB_URL = process.env.DB_PRODUCTION_URL;
        break;
    case 'test':
        process.env.DB_URL = process.env.DB_TEST_URL;
        break;
    default:
        process.env.DB_URL = process.env.DB_DEVELOPMENT_URL;
        break;
}

exec("npx prisma db push", (err, stdout, stderr) => {
    err && console.log(err);
    stdout && console.log(stdout);
    stderr && console.log(stderr);
})