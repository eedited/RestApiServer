import { Sequelize } from 'sequelize';
import * as config from '../config/config';
import User from './user';

type ProdDevTestLiteral = 'production' | 'development' | 'test';
const env: ProdDevTestLiteral = process.env.NODE_ENV as ProdDevTestLiteral || 'development';

const sequelize: Sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    {
        host: config[env].host,
        dialect: config[env].dialect,
        logging: config[env].logging,
    },
);

User.initialize(sequelize);
User.associate();

export { sequelize, User };
