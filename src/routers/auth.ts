import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User } from '@prisma/client';
import DB from '../db';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth';

const router: Router = Router();

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password, email, birthday, nickname }: User = req.body;

    try {
        const userIdPromise: Promise<User | null> = DB.prisma.user.findUnique({ where: { userId } });
        const emailPromise: Promise<User | null> = DB.prisma.user.findUnique({ where: { email } });
        const nicknamePromise: Promise<User | null> = DB.prisma.user.findUnique({ where: { nickname } });
        const users: (User | null)[] = await Promise.all([userIdPromise, emailPromise, nicknamePromise]);
        if (users.filter((user: User | null) => user !== null).length > 0) {
            return res.status(404).json({
                info: '/auth/signup - DB : No such a User of (userId, email, nickname)',
            });
        }

        const salt: number = Number(process.env.BCRYPT_SALT);
        const hashedPassword: string = await bcrypt.hash(password.toString(), salt);
        await DB.prisma.user.create({
            data: {
                userId,
                password: hashedPassword,
                birthday: birthday && new Date(birthday),
                email,
                nickname,
            },
        });

        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/signup - DB Error : Checks DB Connection or CRUD',
        });
    }
});

router.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (authErr: Error | null, user: Express.User | null) => {
        if (authErr) {
            return res.status(500).json({
                info: '/auth/login - Passport Error',
            });
        }
        if (!user) {
            return res.status(401).json({
                info: '/auth/login - Unregistered user or incorrect password',
            });
        }

        return req.login(user, (err: Error) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err: 500,
                    info: '/auth/login - Passport Error',
                });
            }
            return res.status(200).json({});
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, async (req: Request, res: Response) => {
    req.logOut();
    req.session.destroy(() => {});
    return res.status(200).json({});
});

export default router;
