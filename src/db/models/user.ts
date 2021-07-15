import Sequelize from 'sequelize';

export default class User extends Sequelize.Model {
    public readonly id!: number;

    public email!: string;

    public password!: string;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;

    public static initialize(sequelize: Sequelize.Sequelize): void {
        this.init(
            {
                email: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
            },
            {
                sequelize,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    public static associate(): void {
        console.log('User Model Associate...');
    }
}
