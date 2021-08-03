import express, { Application } from 'express';
import request from 'supertest';
import indexRouter from '@src/routers';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(indexRouter);

describe('Router /', () => {
    test('(S) GET /', async () => {
        await request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .expect('hello world');
    });

    test('(F) Post /', async () => {
        await request(app)
            .post('/')
            .expect(404);
    });
});
