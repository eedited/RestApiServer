import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import { User } from '@prisma/client';
import { doesNotMatch } from 'assert';
import DB from '../db';

const client: OAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

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
        req.body.token = req.body.tokenId;
        // eslint-disable-next-line no-self-assign
        req.body.googleId = req.body.googleId;
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

export const isAdmin: expressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { user }: Request = req;
    try {
        if (!user) {
            return res.status(404).json({
                info: 'isAdmin there is no user',
            });
        }
        if (user.admin) {
            return next();
        }
        return res.status(403).json({
            info: 'need admin authorized',
        });
    }
    catch (err) {
        return res.status(500).json({
            info: 'isAdmin Middleware',
        });
    }
};

export const isNotBlock: expressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { user }: Request = req;
    try {
        if (!user) {
            return res.status(404).json({
                info: 'isAdmin there is no user',
            });
        }
        if (!user.block) {
            return next();
        }
        return res.status(456).json({
            info: 'blocked user',
        });
    }
    catch (err) {
        return res.status(500).json({
            info: 'isNotBlock Middleware',
        });
    }
};

export const GoogleLogin: expressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { token, googleId }: typeof req.body = req.body;
    try {
        const ticket: LoginTicket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const userInfo: TokenPayload | undefined = ticket.getPayload();
        if (typeof userInfo === 'undefined') {
            return res.status(404).json({
                info: 'isNotBlock Middleware user Not Found',
            });
        }
        let user: User | null = await DB.prisma.user.findFirst({
            where: {
                email: userInfo.email,
                deletedAt: null,
            },
        });
        if (!user) {
            const nicknamePromise: User | null = await DB.prisma.user.findFirst({
                where: {
                    nickname: userInfo.name,
                    deletedAt: null,
                },
            });
            let CN: number | string = '';
            if (nicknamePromise) {
                CN = await DB.prisma.user.count();
            }
            await DB.prisma.user.create({
                data: {
                    userId: googleId,
                    password: 'Google',
                    email: userInfo.email as string,
                    nickname: userInfo.name as string + CN,
                    logInType: 'Google',
                    emailToken: '',
                    description: '',
                    profilePicture: userInfo.picture,
                },
            });
            user = await DB.prisma.user.findFirst({
                where: {
                    userId: googleId,
                    deletedAt: null,
                },
            });
        }
        req.body.userId = user?.userId;
        return next();
    }
    catch (err) {
        return res.status(500).json({
            info: 'GoogleLogin middleware',
        });
    }
};
