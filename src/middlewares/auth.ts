import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import DB from '../db';

export const isLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const isNotLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const checkPassword: expressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password }: User = req.body;
    try {
        const user1: (User | null) = await DB.prisma.user.findUnique({ where: { userId } });
        if (!user1) {
            return res.status(401).json({
                success: false,
                info: 'Unregistered user',
            });
        }
        const correctpw: boolean = bcrypt.compareSync(password, user1.password);
        if (!correctpw) {
            return res.status(401).json({
                success: false,
                info: 'passwored inconsistency',
            });
        }
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }

    return next();
};
