import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session, { MemoryStore } from 'express-session';
import passport from 'passport';
import redis from 'redis';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';

import passportConfig from './passport';

dotenv.config();

/**
 * Routers
 */
import indexRouter from './routers';
import authRouter from './routers/auth';
import videoRouter from './routers/video';

/**
 * Express.Application Set
 */
const app: Application = express();
app.set('port', process.env.PORT);

/**
 * Middlewares
 */
let morganOption: string = 'dev';
let sessionStoreOption: connectRedis.RedisStore | session.MemoryStore = new MemoryStore();

// production env setting
if (process.env.NODE_ENV === 'production') {
    morganOption = 'combined';

    const RedisStore: connectRedis.RedisStore = connectRedis(session);
    const redisClient: redis.RedisClient = redis.createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
    });
    sessionStoreOption = new RedisStore({ client: redisClient });

    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
}

app.use(morgan(morganOption));
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: String(process.env.COOKIE_SECRET),
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
    store: sessionStoreOption,
}));
passportConfig();
app.use(passport.initialize());
app.use(passport.session());

/**
 * Connect Routers
 */
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/video', videoRouter);

/**
 * Error
 */

// 404 Page_Not_Found
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: Error = new Error(`${req.method} ${req.url} No such a router`);
    error.status = 404;
    next(error);
});

// Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'production' ? {} : err;
    console.error(res.locals.error);
    res.status(err.status || 500);
});

/**
 * Export
 */
export default app;
