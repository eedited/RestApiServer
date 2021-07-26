import chalk from 'chalk';
import app from './app';
import DB from './db';

DB.prisma.$connect()
    .then(() => {
        console.log('\nDB Connect...');
    })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`Listening on Port ${chalk.bold.bgMagenta.white(`${app.get('port')}`)}...`);
            console.log(`NODE_ENV=${chalk.bold.bgBlue.white(`${process.env.NODE_ENV}`)}...\n`);
        });
    })
    .catch((err: Error) => {
        console.log(`\n>>>>>   ${chalk.bold.red('DB Connection Error')}   <<<<<`);
        console.log(`>>>>>     ${chalk.bold.red('Sever  Shutdown')}     <<<<<\n`);
    });
