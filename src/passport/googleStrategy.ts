import { Request } from 'express';
import passport from 'passport';
import googlePassport from 'passport-google-oauth2';
import { User } from '@prisma/client';
import DB from '../db';

const googleStrategyConfig: googlePassport.StrategyOptionsWithRequest = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleStrategyVerify: googlePassport.VerifyFunctionWithRequest = async (req: Request, accessToken: string, refreshToken: string, profile: any, done: googlePassport.VerifyCallback) => {
    try {
        let user: User | null = await DB.prisma.user.findFirst({ where: { userId: profile.id, deletedAt: null } });
        if (!user) {
            // 이메일, 닉네임 중복체크
            const emailPromise: User | null = await DB.prisma.user.findFirst({ where: { email: profile.email, deletedAt: null } });
            if (emailPromise) {
                user = emailPromise;
            }
            else {
                const nicknamePromise: User | null = await DB.prisma.user.findFirst({ where: { nickname: profile.displayName, deletedAt: null } });
                const CN: number = await DB.prisma.user.count();
                const S3ImgageIdx: number = Math.floor(Math.random() * 47);
                if (nicknamePromise) {
                    await DB.prisma.user.create({
                        data: {
                            userId: profile.id,
                            password: 'Google',
                            email: profile.email,
                            nickname: profile.displayName + CN,
                            logInType: 'Google',
                            emailToken: '',
                            description: '',
                            profilePicture: `${process.env.DEFAULT_PROFILE_URL}/img/_default/${S3ImgageIdx}.jpeg`,
                        },
                    });
                }
                else {
                    await DB.prisma.user.create({
                        data: {
                            userId: profile.id,
                            password: 'Google',
                            email: profile.email,
                            nickname: profile.displayName,
                            logInType: 'Google',
                            emailToken: '',
                            description: '',
                            profilePicture: `${process.env.DEFAULT_PROFILE_URL}/img/_default/${S3ImgageIdx}.jpeg`,
                        },
                    });
                }
                user = await DB.prisma.user.findFirst({ where: { userId: profile.id, deletedAt: null } });
            }
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, null);
    }
};

export default function googleStrategy(): void {
    passport.use(new googlePassport.Strategy(googleStrategyConfig, googleStrategyVerify));
}
