import express from 'express';
import bcrypt from 'bcrypt';
// import passport from 'passport';
import User from '../models/user';

import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth';

const router: express.Router = express.Router();

router.post('/signup', isNotLoggedIn, async (req: Express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password }: { email: string, password: string } = req.body;
    console.log(email, password);
    try {
        const user: (User | null) = await User.findOne({ where: { email } });
        if (user) return res.redirect('/signup?err=user_already_exist');
        console.log(user);
        const salt: number = Number(process.env.BCRYPT_SALT);
        console.log(salt);
        const hashedPassword: string = await bcrypt.hash(password.toString(), salt);
        console.log(hashedPassword);
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

// router.post('/login', isNotLoggedIn, (req, res, next) => {
//     passport.authenticate('local', { session: false }, (authErr, user, info) => {
//         if (authErr) {
//             console.error(authErr);
//             next(authErr);
//         }
//         else if (!user) {
//             return res.redirect(`/login?loginErr=${info.message}`);
//         }

//         req.login(user, { session: false }, (err) => {
//             if (err) {
//                 console.error(err);
//                 next(err);
//             }

//             const token = jwt.sign(
//                 {
//                     id: user.id,
//                 },
//                 process.env.JWT_SECRET,
//                 {
//                     expiresIn: '5m',
//                     issuer: process.env.JWT_ISSUER,
//                 },
//             );
//             return res.json({ token });
//         });
//     })(req, res, next);
// });

// router.get('/logout', isLoggedIn, (req, res) => {
//     // 대충 redis에 blacklist 등록하는 코드
//     res.redirect('/');
// });

export default router;
