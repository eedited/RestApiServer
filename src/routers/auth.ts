import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User, Prisma } from '@prisma/client';
import DB from '../db';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth';

const router: Router = Router();

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password, email, birthday }: User = req.body;
    try {
        const user1: (User | null) = await DB.prisma.user.findUnique({ where: { userId } });
        if (user1) {
            return res.status(401).json({
                success: false,
                info: 'Same userId already exists',
            });
        }
        const user2: (User | null) = await DB.prisma.user.findUnique({ where: { email } });
        if (user2) {
            return res.status(402).json({
                success: false,
                info: 'The email is already used for another ID',
            });
        }
        const salt: number = Number(process.env.BCRYPT_SALT);
        const hashedPassword: string = await bcrypt.hash(password.toString(), salt);
        let input: Prisma.UserCreateInput;
        if (birthday) {
            console.log(birthday);
            const birthdayForQuery: Date = new Date(birthday as unknown as Date);
            input = {
                userId,
                password: hashedPassword,
                birthday: birthdayForQuery,
                email,
            };
        }
        else {
            input = {
                userId,
                password: hashedPassword,
                email,
            };
        }
        await DB.prisma.user.create({
            data: input,
        });
        return res.status(200).json({
            success: true,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

router.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (authErr: Error | null, user: Express.User | null) => {
        if (authErr) {
            return res.status(501).json({
                success: false,
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                info: 'Unregistered user or incorrect password',
            });
        }

        return req.login(user, (err: Error) => {
            if (err) {
                res.status(502).json({
                    success: false,
                });
            }
            return res.status(200).json({
                success: true,
            });
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req: Request, res: Response) => {
    req.logOut();
    req.session.destroy((err: Error | null) => {
        if (err) {
            res.status(501).json({
                success: false,
            });
        }
    });
    return res.status(200).json({
        success: true,
    });
});

export default router;
