import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../db/models/user';

import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth';

const router: Router = Router();

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
        const user: (User | null) = await User.findOne({ where: { email } });
        if (user) return res.redirect('/signup?err=user_already_exist');
        const salt: number = Number(process.env.BCRYPT_SALT);
        const hashedPassword: string = await bcrypt.hash(password.toString(), salt);
        await User.create({
            email,
            password: hashedPassword,
        });
        return res.redirect('/');
    }
    catch (err) {
        console.error(err);
        return next(err);
    }
});

interface Info {
    message: string
}
router.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (authErr: Error, user: Express.User, info: Info) => {
        if (authErr) return next(authErr);
        if (!user) return res.redirect(`/login?loginErr=${info.message}`);

        return req.login(user, (err: Error) => {
            if (err) {
                console.error(err);
                next(err);
            }
            return res.json({ });
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req: Request, res: Response) => {
    // 대충 redis에서 뭐 없애는 코드
    res.redirect('/');
});

export default router;
