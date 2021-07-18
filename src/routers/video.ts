import { Request, Response, NextFunction, Router } from 'express';
import { PrismaClient, users } from '@prisma/client';
import { videoUploaded } from '../middlewares/video';

const router: Router = Router();

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    const prisma: PrismaClient = new PrismaClient();
    const { title,
        discription,
        url,
        uploader }: {
        title: string;
        discription: string;
        url: string;
        uploader: string;} = req.body;

    try {
        console.log(req.body);
        const user: (users | null) = await prisma.users.findUnique({ where: { userId: uploader } });
        if (!user) return res.redirect('/upload?err=uploader_not_exist');
        await prisma.videos.create({
            data: {
                title,
                discription,
                url,
                uploader,
            },
        });
        return next();
    }
    catch (err) {
        return next(err);
    }
}, videoUploaded);

export default router;
