/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
const { exec } = require('child_process');
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
process.env.DB_URL += process.env.npm_package_version;

exec('npx prisma db push', (err, stdout, stderr) => {
    err && console.log(err);
    stdout && console.log(stdout);
    stderr && console.log(stderr);
});
