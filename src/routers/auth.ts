import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User, Prisma } from '@prisma/client';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import DB from '../db';
import { isLoggedIn, isNotLoggedIn, checkPassword } from '../middlewares/auth';

const router: Router = Router();

async function sendEmail(email: string, subject: string, Contents: string): Promise<void> {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        },
    });
    const mailOptions: SMTPTransport.SentMessageInfo = await transporter.sendMail({
        from: 'test',
        to: email,
        bcc: [],
        subject,
        html: `<b>Hello world?${Contents}</b>`,
    });
    transporter.sendMail(mailOptions, (error: Error | null) => {
        if (error) {
            console.log(error);
        }
        transporter.close();
    });
}

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password, email, birthday, nickname }: User = req.body;

    try {
        const userIdPromise: Promise<User | null> = DB.prisma.user.findUnique({ where: { userId } });
        const emailPromise: Promise<User | null> = DB.prisma.user.findUnique({ where: { email } });
        const nicknamePromise: Promise<User | null> = DB.prisma.user.findUnique({ where: { nickname } });
        const users: (User | null)[] = await Promise.all([userIdPromise, emailPromise, nicknamePromise]);
        if (users.filter((user: User | null) => user !== null).length > 0) {
            return res.status(404).json({
                info: '/auth/signup - DB : exists User of (userId, email, nickname)',
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

router.post('/find/id', isNotLoggedIn, async (req: Request, res: Response) => {
    const { email }: User = req.body;
    try {
        const user: (User | null) = await DB.prisma.user.findUnique({ where: { email } });
        if (user) {
            sendEmail(email, '아이디 찾기', user.userId);
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
        const user: (User | null) = await DB.prisma.user.findUnique({ where: { userId } });
        if (user && user.email === email) {
            const salt: number = Number(process.env.BCRYPT_SALT);
            const changedPassword: string = Math.random().toString(36).slice(2);
            const hashedPassword: string = await bcrypt.hash(changedPassword, salt);
            await DB.prisma.user.update({
                where: {
                    userId,
                },
                data: {
                    password: hashedPassword,
                },
            });
            sendEmail(email, '비밀번호 초기화', changedPassword);
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
            where: {
                userId,
            },
            data: {
                password: hashedPassword,
            },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/change/password server err',
        });
    }
});

router.post('/mail', isLoggedIn, async (req: Request, res: Response) => {
    try {
        const { email }: User = req.body;
        const randomNum: string = Math.random().toString().slice(2, 7);
        console.log(1);
        sendEmail(email, '회원가입을 위한 인증번호를 입력해주세요', randomNum);
        return res.status(200).json({
            randomNum,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/auth/mail server err',
        });
    }
});

export default router;
