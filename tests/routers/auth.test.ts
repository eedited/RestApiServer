import express, { Application } from 'express';
import request from 'supertest';
import authRouter from '@src/routers/auth';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authRouter);

describe('Router /auth', () => {
    // test('(S) Post /signup', async () => {
    //     await request(app)
    //         .post('/')
    //         .expect(200)
    //         .expect('Content-Type', /json/)
    //         .expect('hello world');
    // });

    test('(F) Get /signup', async () => {
        await request(app)
            .get('/signup')
            .expect(4044);
    });
});
