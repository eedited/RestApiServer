import passport from 'passport';
import passportCustom from 'passport-custom';
import { Request } from 'express';

import { PrismaClient, User } from '@prisma/client';

const googleCustomStrategyVerify: passportCustom.VerifyCallback = async (req: Request, done: passportCustom.VerifiedCallback) => {
    const prisma: PrismaClient = new PrismaClient();
    try {
        const user: (User | null) = await prisma.user.findFirst({ where: { userId: req.body.userId, deletedAt: null } });
        if (!user) return done(null, null);
        return done(null, user);
    }
    catch (err) {
        return done(err, null);
    }
};

export default function googleCustomStrategy(): void {
    passport.use('googleCustom', new passportCustom.Strategy(googleCustomStrategyVerify));
}
