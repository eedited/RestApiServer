# How to Start

## [Back to Main](../README.md)

> Updated: 8/17 2021. \
> v0.3.2

---

## Node Engine

> 14.16.1

## Node Dependencies

    "@prisma/client": "2.27.0",
    "aws-sdk": "2.948.0",
    "bcrypt": "5.0.1",
    "chalk": "4.1.1",
    "connect-redis": "6.0.0",
    "cookie-parser": "1.4.5",
    "cross-env": "7.0.3",
    "dotenv": "10.0.0",
    "express": "4.17.1",
    "express-session": "1.17.2",
    "helmet": "4.6.0",
    "hpp": "0.2.3",
    "morgan": "1.10.0",
    "multer": "1.4.2",
    "multer-s3": "2.9.0",
    "nodemailer": "6.6.3",
    "passport": "0.4.1",
    "passport-local": "1.0.0",
    "pm2": "5.1.0",
    "redis": "3.1.2",
    "winston": "3.3.3"

---

## dotenv

you must make .env file in root of your project directory.

> touch .env

Some env variables have to be included in .env file, o.w. server will emit errors which env variable have to be set when it runs.

---

## Pre-Start

Before starting server, We have to build database using Prisma Schemas.

> npm run db:gen && npm run db:push<br>
> npm run db:create

Both script are exactly same, so you can use anything.

---

## Start

### Production

> npm start<br>
> npm run start

### Development

> npm run dev<br>
> npm run dev:dist

`npm run dev` runs on `ts-node`, whereas `npm run dev:dist` runs on `tsc & node`.

---

## Stop

Use command below if you run server on production environment.

> npm run shutdown

Or you can kill using PID of pm2.

> kill -9 ${PID}
