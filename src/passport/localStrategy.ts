import passport from 'passport';
import localPassport from 'passport-local';
import bcrypt from 'bcrypt';

import { PrismaClient, User } from '@prisma/client';

interface localStrategyConfigType {
    usernameField: string,
    passwordField: string
}
const localStrategyConfig: localStrategyConfigType = {
    usernameField: 'userId',
    passwordField: 'password',
};

type doneFunctionType = (error: Error | null, user: Express.User | null) => void;
const localStrategyVerify: localPassport.VerifyFunction = async (userId: string, password: string, done: doneFunctionType) => {
    const prisma: PrismaClient = new PrismaClient();
    try {
        const user: (User | null) = await prisma.user.findUnique({ where: { userId } });
        if (!user) return done(null, null);

        const isMatched: boolean = await bcrypt.compare(password, user.password);
        if (!isMatched) return done(null, null);

        return done(null, user);
    }
    catch (err) {
        return done(err, null);
    }
};

export default function localStrategy(): void {
    passport.use(new localPassport.Strategy(localStrategyConfig, localStrategyVerify));
}
