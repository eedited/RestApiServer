import { Request, Response, NextFunction, Router } from 'express';
import bcrypt, { hash } from 'bcrypt';
import passport from 'passport';
import { User } from '@prisma/client';
import { signupValidation } from '../services/mailContent';
import { isLoggedIn, isNotLoggedIn, checkPassword } from '../middlewares/auth';
import sendEmail from '../services/sendEmail';
import DB from '../db';

const router: Router = Router();

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password, email, birthday, nickname, profilePicture }: User = req.body;
    try {
        const userIdPromise: Promise<User | null> = DB.prisma.user.findFirst({ where: { userId, deletedAt: null } });
        const emailPromise: Promise<User | null> = DB.prisma.user.findFirst({ where: { email, deletedAt: null } });
        const nicknamePromise: Promise<User | null> = DB.prisma.user.findFirst({ where: { nickname, deletedAt: null } });
        const users: (User | null)[] = await Promise.all([userIdPromise, emailPromise, nicknamePromise]);
        if (users.filter((user: User | null) => user !== null).length > 0) {
            return res.status(404).json({
                info: '/auth/signup - DB : exists User of (userId, email, nickname)',
            });
        }

        const salt: number = Number(process.env.BCRYPT_SALT);
        const hashedPassword: string = await bcrypt.hash(password.toString(), salt);
        const randomToken: string = Math.random().toString(36).slice(2);
        const hashedToken: string = await bcrypt.hash(randomToken, salt);
        await DB.prisma.user.create({
            data: {
                userId,
                password: hashedPassword,
                birthday: birthday && new Date(birthday),
                email,
                nickname,
                profilePicture,
                emailToken: hashedToken,
                description: '',
            },
        });
        await sendEmail(email, '[eedited] 회원가입을 위한 메일 인증', signupValidation(hashedToken));
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/signup - DB Error : Checks DB Connection or CRUD',
        });
    }
});
router.post('/signup/emailValidation', async (req: Request, res: Response) => {
    const { token }: typeof req.body = req.body;
    try {
        if (!token) {
            return res.status(400).json({
                info: '/auth/signup/emailValidation : need token as input',
            });
        }
        const user: User|null = await DB.prisma.user.findFirst({ where: { emailToken: token } });
        if (!user) {
            return res.status(403).json({
                info: '/auth/signup/emailValidation : invalid token',
            });
        }
        await DB.prisma.user.update({
            where: { userId: user.userId },
            data: { emailToken: '' },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/signup/emailValidation : Check DB Connection or CRUD',
        });
    }
});
router.get('/signup/email', isLoggedIn, async (req: Request, res: Response) => {
    const { user }: Request = req;
    if (!user) {
        return res.status(404).json({
            info: '/auth/signup/email : need login',
        });
    }
    if (user.emailToken === '') {
        return res.status(403).json({
            info: '/auth/signup/email : already authed',
        });
    }
    try {
        await sendEmail(user.email, '[eedited] 회원가입을 위한 메일 인증', signupValidation(user.emailToken));
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/email - gmail err',
        });
    }
});

router.get('/check', isLoggedIn, async (req: Request, res: Response) => {
    const user: Express.User = req.user as Express.User;
    return res.status(200).json({
        ...user,
    });
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

router.post('/find/id', isNotLoggedIn, async (req: Request, res: Response) => {
    const { email }: User = req.body;
    try {
        const user: (User | null) = await DB.prisma.user.findFirst({ where: { email, deletedAt: null } });
        if (user) {
            await sendEmail(email, '아이디 찾기', user.userId);
            return res.status(200).json({});
        }
        return res.status(401).json({
            info: 'auth/find/id not exists email',
        });
    }
    catch (err) {
        return res.status(500).json({
            info: 'auth/find/id router error',
        });
    }
});

router.post('/find/password', isNotLoggedIn, async (req: Request, res: Response) => {
    const { userId, email }: User = req.body;
    try {
        const user: (User | null) = await DB.prisma.user.findFirst({ where: { userId, deletedAt: null } });
        if (user && user.email === email) {
            const salt: number = Number(process.env.BCRYPT_SALT);
            const changedPassword: string = Math.random().toString(36).slice(2);
            const hashedPassword: string = await bcrypt.hash(changedPassword, salt);
            await DB.prisma.user.update({
                where: { userId },
                data: { password: hashedPassword },
            });
            await sendEmail(email, '비밀번호 초기화', changedPassword);
            return res.status(200).json({
                password: changedPassword,
            });
        }
        if (user) {
            return res.status(401).json({
                info: '/auth/find/password incorrect email',
            });
        }
        return res.status(401).json({
            info: '/auth/find/password no user',
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/find/password server error',
        });
    }
});

router.post('/change/password', isLoggedIn, checkPassword, async (req: Request, res: Response) => {
    const { userId }: User = req.body;
    const { newpassword }: {newpassword: string} = req.body;
    try {
        const salt: number = Number(process.env.BCRYPT_SALT);
        const hashedPassword: string = await bcrypt.hash(newpassword.toString(), salt);
        await DB.prisma.user.update({
            where: { userId },
            data: { password: hashedPassword },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/change/password server err',
        });
    }
});

router.delete('/:userId', isLoggedIn, async (req: Request, res: Response) => {
    const { userId }: typeof req.params = req.params;
    const user: Express.User = req.user as Express.User;
    try {
        if (userId !== user.userId) {
            return res.status(401).json({
                info: '/auth/:userId Unauthorized',
            });
        }
        await DB.prisma.user.delete({
            where: { userId },
        });
        req.session.destroy((err: Error) => {
            if (err) {
                res.status(400).json({
                    info: 'already not loggedIn',
                });
            }
            else {
                res.status(200).json({});
            }
        });
        return res;
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/:userId server error',
        });
    }
});

export default router;
