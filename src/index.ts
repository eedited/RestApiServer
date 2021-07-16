import app from './app';

app.listen(app.get('port'), () => {
    console.log(`Listening on Port ${app.get('port')}...`);
    console.log(`NODE_ENV=${process.env.NODE_ENV}...`);
});
