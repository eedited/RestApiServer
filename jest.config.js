/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@db$': '<rootDir>/src/db.ts',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@routers/(.*)$': '<rootDir>/src/routers/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
    },
};
