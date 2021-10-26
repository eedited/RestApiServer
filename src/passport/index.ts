import passport from 'passport';
import { User } from '@prisma/client';
import DB from '../db';
import localStrategy from './localStrategy';
import googleStrategy from './googleStrategy';
import googleCustomStrategy from './googleCustomStrategy';

export default function passportConfig(): void {
    passport.serializeUser((user: Express.User, done: (err: Error | null, id: string) => void) => {
        const { userId }: User = user;
        done(null, userId);
    });

    passport.deserializeUser((userId: string, done: (err: Error | null, user?: Express.User | null) => void) => {
        DB.prisma.user.findUnique({ where: { userId } })
            .then((user: User | null) => done(null, user))
            .catch((err: Error) => done(err));
    });

    localStrategy();
    googleStrategy();
    googleCustomStrategy();
}
