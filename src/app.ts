/* eslint-disable no-console */
import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session, { MemoryStore } from 'express-session';
import passport from 'passport';
import redis from 'redis';
import connectRedis from 'connect-redis';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import checkEnv from './checkEnv';
import passportConfig from './passport';

/**
 * Routers
 */
import indexRouter from './routers';
import authRouter from './routers/auth';
import videoRouter from './routers/video';
import userRouter from './routers/user';
import searchRouter from './routers/search';

// Check Which each env Variable is set or not
checkEnv();

/**
 * Express.Application Set
 */
const app: Application = express();
app.set('port', process.env.PORT);
app.set('trust proxy', 1);

/**
 * Middlewares
 */
let morganOption: string = 'dev';
let sessionStoreOption: connectRedis.RedisStore | session.MemoryStore = new MemoryStore();

// CORS
const protocol: string = process.env.FE_PROTOCOL as string;
const domain: string = process.env.FE_URL as string;
app.use(cors({
    origin: [`${protocol}://${domain}`, `${protocol}://www.${domain}`],
    credentials: true,
}));

// production env setting
if (process.env.NODE_ENV === 'production') {
    morganOption = 'combined';

    const RedisStore: connectRedis.RedisStore = connectRedis(session);
    const redisClient: redis.RedisClient = redis.createClient({
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
    });
    sessionStoreOption = new RedisStore({ client: redisClient });

    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
}
else if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swaggerSpec: any = YAML.load(path.join(__dirname, '../swagger/index.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use(morgan(morganOption));
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: String(process.env.COOKIE_SECRET),
    proxy: process.env.NODE_ENV === 'production',
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 15, // 15 min
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
app.use('/user', userRouter);
app.use('/search', searchRouter);

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
    return res.status(err.status || 500).json({
        info: res.locals.error,
    });
});

/**
 * Export
 */
export default app;
