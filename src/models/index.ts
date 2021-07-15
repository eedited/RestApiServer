import { Sequelize } from 'sequelize';
import * as config from '../config/config';
import User from './user';

type ProdDevTestLiteral = 'production' | 'development' | 'test';
const env: ProdDevTestLiteral = process.env.NODE_ENV as ProdDevTestLiteral || 'development';

const sequelize: Sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    config[env],
);

User.initialize(sequelize);
User.associate();

export { sequelize, User };
