import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User, Prisma } from '@prisma/client';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import DB from '../db';
import { isLoggedIn, isNotLoggedIn, checkPassword } from '../middlewares/auth';

const router: Router = Router();

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password, email, birthday, nickname }: User = req.body;
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
        const user3: (User | null) = await DB.prisma.user.findUnique({ where: { nickname } });
        if (user3) {
            return res.status(402).json({
                success: false,
                info: 'Same nickname already exists',
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

router.post('/find/id', isNotLoggedIn, async (req: Request, res: Response) => {
    const { email }: User = req.body;
    try {
        const user: (User | null) = await DB.prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(200).json({
                id: user.userId,
            });
        }
        return res.status(400).json({
            exists: false,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
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
            return res.status(200).json({
                password: changedPassword,
            });
        }
        if (user) {
            return res.status(400).json({
                email: 'incorrect',
            });
        }
        return res.status(400).json({
            exists: false,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
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
        return res.status(200).json({
            password: 'changedPassword success',
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

router.post('/mail', isLoggedIn, async (req: Request, res: Response) => {
    try {
        const { email }: User = req.body;
        const randomNum: string = Math.random().toString().slice(2);
        const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
            service: 'gmail',
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
            subject: '회원가입을 위한 인증번호를 입력해주세요.',
            html: `<b>Hello world?${randomNum}</b>`,
        });
        transporter.sendMail(mailOptions, (error: Error | null) => {
            if (error) {
                console.log(error);
            }
            res.send(randomNum);
            transporter.close();
        });
        return res.status(200).json({
            success: true,
            randomNum,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
            err,
        });
    }
});
export default router;
