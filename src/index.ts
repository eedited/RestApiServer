import { PrismaClient } from '@prisma/client';
import app from './app';

const prisma: PrismaClient = new PrismaClient();

prisma.$connect()
    .then(() => {
        console.log('DB Connect...');
    })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`Listening on Port ${app.get('port')}...`);
            console.log(`NODE_ENV=${process.env.NODE_ENV}...`);
        });
    })
    .catch((err: Error) => {
        console.log('>>>>>   DB Connection Error   <<<<<');
        console.log('>>>>>     Sever  Shutdown     <<<<<');
    });
