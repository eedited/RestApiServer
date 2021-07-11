import express from 'express';

const app: express.Application = express();
app.set('port', process.env.PORT || 8000);

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const a: number = 3;
    console.log(a);
    res.send('hello typescript express!!');
});

app.listen(app.get('port'), () => {
    console.log(`Listening on Port ${app.get('port')}...`);
});
