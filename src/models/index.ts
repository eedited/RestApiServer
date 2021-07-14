import { Sequelize } from 'sequelize';
import { config, ProdDevTestLiteral } from '../config/config';
import User from './user';

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
