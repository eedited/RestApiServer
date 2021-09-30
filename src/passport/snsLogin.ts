import { Request } from 'express';
import passport from 'passport';
import googlePassport from 'passport-google-oauth2';

const googleStrategyConfig: googlePassport.StrategyOptionsWithRequest = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleStrategyVerify: googlePassport.VerifyFunctionWithRequest = async (req: Request, accessToken: string, refreshToken: string, profile: any, done: googlePassport.VerifyCallback) => {
    try {
        console.log(profile);
        return done(null, profile);
    }
    catch (err) {
        return done(err, null);
    }
};

export default function googleStrategy(): void {
    passport.use(new googlePassport.Strategy(googleStrategyConfig, googleStrategyVerify));
}
