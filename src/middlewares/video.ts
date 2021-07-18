import { Request, Response, NextFunction } from 'express';
import { PrismaClient, users } from '@prisma/client';

export const videoUploaded: expressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const prisma: PrismaClient = new PrismaClient();
    const { uploader }: { uploader: string;} = req.body;

    try {
        console.log('middleware');
        const user: (users | null) = await prisma.users.findUnique({ where: { userId: uploader } });
        if (!user) return res.redirect('/upload?err=uploader_not_exist');
        await prisma.users.update({
            where: { userId: uploader },
            data: { uploadVideoCnt: user.uploadVideoCnt + 1 },
        });
        return res.redirect('/');
    }
    catch (err) {
        return next(err);
    }
};
