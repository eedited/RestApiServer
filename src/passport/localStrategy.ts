import passport from 'passport';
import * as localPassport from 'passport-local';
import bcrypt from 'bcrypt';

import User from '../db/models/user';

interface localStrategyConfigType {
    usernameField: string,
    passwordField: string
}
const localStrategyConfig: localStrategyConfigType = {
    usernameField: 'id',
    passwordField: 'password',
};

type doneFunction = (error?: Error, user?: Express.User, options?: localPassport.IVerifyOptions) => void;
const localStrategyVerify: localPassport.VerifyFunction = async (id: string, password: string, done: doneFunction) => {
    try {
        const user: (User | null) = await User.findOne({ where: { id } });
        if (!user) return done(undefined, undefined, { message: 'No Registered User' });

        const isMatched: boolean = await bcrypt.compare(password, user.password);
        if (!isMatched) return done(undefined, undefined, { message: 'Password does not match' });

        return done(undefined, user);
    }
    catch (err) {
        console.error(err);
        return done(err);
    }
};

export default function localStrategy(): void {
    passport.use(new localPassport.Strategy(localStrategyConfig, localStrategyVerify));
}
