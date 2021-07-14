import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
// import passport from 'passport';

dotenv.config();
import authRouter from './routers/auth';
import * as db from './models';

const app: express.Application = express();
app.set('port', process.env.PORT || 8000);

app.use(morgan('dev'));
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'bEd389Edxkfnl4nj2',
    cookie: {
        httpOnly: true,
        secure: true,
    },
}));
db.sequelize
    .sync({ force: false })
    .then(() => {
        console.log('Database Connected...');
    })
    .catch((err: Error) => {
        console.error(err);
    });

app.use('/auth', authRouter);

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const a: number = 3;
    console.log(a);
    res.send('hello typescript express!!');
});

app.listen(app.get('port'), () => {
    console.log(`Listening on Port ${app.get('port')}...`);
    console.log(`NODE_ENV=${process.env.NODE_ENV || 'development'}...`);
});
