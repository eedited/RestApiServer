import passport from 'passport';
import localPassport from 'passport-local';
import bcrypt from 'bcrypt';

import { PrismaClient, users } from '@prisma/client';

interface localStrategyConfigType {
    usernameField: string,
    passwordField: string
}
const localStrategyConfig: localStrategyConfigType = {
    usernameField: 'id',
    passwordField: 'password',
};

type doneFunction = (error?: Error, user?: Express.User, options?: localPassport.IVerifyOptions) => void;
const localStrategyVerify: localPassport.VerifyFunction = async (email: string, password: string, done: doneFunction) => {
    const prisma: PrismaClient = new PrismaClient();
    try {
        const user: (users | null) = await prisma.users.findUnique({ where: { email } });
        if (!user) return done(undefined, undefined, { message: 'No Registered User' });

        const isMatched: boolean = await bcrypt.compare(password, user.password);
        if (!isMatched) return done(undefined, undefined, { message: 'Password does not match' });

        return done(undefined, user);
    }
    catch (err) {
        return done(err);
    }
};

export default function localStrategy(): void {
    passport.use(new localPassport.Strategy(localStrategyConfig, localStrategyVerify));
}
