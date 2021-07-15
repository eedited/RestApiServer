import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

import passportConfig from './passport';
import * as db from './models';

/**
 * Routers
 */
import indexRouter from './routers';
import authRouter from './routers/auth';

/**
 * Express.Application Set
 */
const app: Application = express();
app.set('port', process.env.PORT || 8000);

/**
 * Middlewares
 */
app.use(morgan('dev'));
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: String(process.env.COOKIE_SECRET),
    cookie: {
        httpOnly: true,
        secure: true,
    },
}));
passportConfig();
app.use(passport.initialize());
app.use(passport.session());

/**
 * Connect DB
*/
db.sequelize
    .sync({ force: false })
    .then(() => {
        console.log('Database Connected...');
    })
    .catch((err: Error) => {
        console.error(err);
    });

/**
 * Connect Routers
 */
app.use('/', indexRouter);
app.use('/auth', authRouter);

// 404 Page_Not_Found
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: Error = new Error(`${req.method} ${req.url} No such a router`);
    error.status = 404;
    next(error);
});

// Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// export
export default app;
