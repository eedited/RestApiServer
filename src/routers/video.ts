import { Request, Response, NextFunction, Router } from 'express';
import { User, Video } from '@prisma/client';
import { Prisma } from '.prisma/client';
import DB from '../db';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result: Video[] = await DB.prisma.video.findMany({ });
        return res.status(200).json({
            success: true,
            result,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

router.get('/sort/latest', async (req: Request, res: Response) => {
    try {
        const result: Video[] = await DB.prisma.video.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return res.status(200).json({
            success: true,
            result,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

router.get('/sort/thumbup', async (req: Request, res: Response) => {
    try {
        const result: Video[] = await DB.prisma.video.findMany({
            orderBy: {
                likeCnt: 'desc',
            },
        });
        return res.status(200).json({
            success: true,
            result,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

router.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
    const { title, discription, url, uploader }: Video = req.body;
    try {
        const user: (User | null) = await DB.prisma.user.findUnique({ where: { userId: uploader } });
        if (!user) return res.redirect('/upload?err=uploader_not_exist');
        await DB.prisma.video.create({
            data: {
                title,
                discription,
                url,
                uploader,
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

type nextType = (params: Prisma.MiddlewareParams) => Promise<unknown>;

DB.prisma.$use(async (params: Prisma.MiddlewareParams, next: nextType) => {
    if (params.model === 'Video' && params.action === 'create') {
    // Logic only runs for delete action and Post model
        await DB.prisma.user.update({
            where: {
                userId: params.args.data.uploader,
            },
            data: {
                uploadVideoCnt: { increment: 1 },
            },
        });
    }
    return next(params);
});

export default router;
