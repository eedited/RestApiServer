import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import DB from '../db';

export const isLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(403).json({
        info: 'Login Required',
    });
};

export const isNotLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(403).json({
        info: 'Account is already logged in',
    });
};

export const checkPassword: expressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { password }: typeof req.body = req.body;
    const { user }: Request = req;
    try {
        // const user: (User | null) = await DB.prisma.user.findUnique({ where: { userId } });
        // if (!user) {
        //     return res.status(401).json({
        //         info: 'Unregistered user',
        //     });
        // }
        if (!user) {
            return res.status(404).json({
                info: 'there is no user',
            });
        }
        const isPwCorrect: boolean = bcrypt.compareSync(password, user.password);
        if (!isPwCorrect) {
            return res.status(401).json({
                info: 'passwored inconsistency',
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            info: 'checkPassword Middleware',
        });
    }
    return next();
};
