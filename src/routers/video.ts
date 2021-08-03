import { Request, Response, Router } from 'express';
import { User, Video, VideoLiker } from '@prisma/client';
import { isLoggedIn } from '../middlewares/auth';
import DB from '../db';

const router: Router = Router();

router.get('/:pageStr', async (req: Request, res: Response) => {
    const take: number = 20;
    const { pageStr }: typeof req.params = req.params;
    try {
        const pageNum: number = pageStr ? 0 : Number(pageStr);
        const videos: Video[] = await DB.prisma.video.findMany({
            where: {
                deletedAt: null,
            },
            take,
            skip: pageNum * take,
        });
        return res.status(200).json({
            videos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: `/video/${pageStr} router error`,
        });
    }
});

router.get('/sort/latest', async (req: Request, res: Response) => {
    try {
        const videos: Video[] = await DB.prisma.video.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return res.status(200).json({
            videos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/video/sort/latest router error',
        });
    }
});

router.get('/sort/thumbup', async (req: Request, res: Response) => {
    try {
        const videos: Video[] = await DB.prisma.video.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                likeCnt: 'desc',
            },
        });
        return res.status(200).json({
            videos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/video/sort/thumbup router error',
        });
    }
});

router.post('/upload', isLoggedIn, async (req: Request, res: Response) => {
    const { title, discription, url, thumbnail }: Video = req.body;
    try {
        const user: Express.User = req.user as Express.User;

        // const user: (User | null) = await DB.prisma.user.findFirst({ where: { userId: req.user.userId, deletedAt: null } });
        // if (!user) return res.status(401).json({
        //     info: 'video/upload not exists user',
        // });
        await DB.prisma.video.create({
            data: {
                title,
                discription,
                url,
                thumbnail,
                uploader: user.userId,
            },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/video/upload router error',
        });
    }
});

router.get('/:videoId', async (req: Request, res: Response) => {
    const { videoId }: typeof req.params = req.params;
    try {
        const video: (Video | null) = await DB.prisma.video.findUnique({
            where: {
                id: videoId,
            },
        });
        if (!video || video.deletedAt !== null) {
            return res.status(404).json({
                info: '/video/:videoId not exists video',
            });
        }
        await DB.prisma.video.update({
            where: {
                uploader_id: {
                    id: videoId,
                    uploader: video.uploader,
                },
            },
            data: {
                viewCnt: { increment: 1 },
            },
        });
        return res.status(200).json({
            video,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/video/upload router error',
        });
    }
});

router.patch('/:videoId/like', isLoggedIn, async (req: Request, res: Response) => {
    const { videoId }: typeof req.params = req.params;
    const user: Express.User = req.user as Express.User;
    try {
        const video: (Video | null) = await DB.prisma.video.findFirst({
            where: {
                id: videoId,
                deletedAt: null,
            },
        });
        if (video == null) {
            return res.status(404).json({
                info: '/:videoId/like user undefind or video not exists',
            });
        }
        const videoLiker: (VideoLiker | null) = await DB.prisma.videoLiker.findFirst({
            where: {
                videoId,
                liker: user.userId,
                uploader: video.uploader,
            },
        });
        if (videoLiker) {
            if (videoLiker.deletedAt !== null) {
                await DB.prisma.videoLiker.update({
                    where: {
                        liker_uploader_videoId: {
                            videoId,
                            liker: user.userId,
                            uploader: video.uploader,
                        },
                    },
                    data: {
                        deletedAt: null,
                    },
                });
            }
            else {
                await DB.prisma.videoLiker.update({
                    where: {
                        liker_uploader_videoId: {
                            videoId,
                            liker: user.userId,
                            uploader: video.uploader,
                        },
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
            }
        }
        else {
            await DB.prisma.videoLiker.create({
                data: {
                    videoId,
                    liker: user.userId,
                    uploader: video.uploader,
                },
            });
        }
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/:videoId/like router error',
        });
    }
});

router.get('/:videoId/delete', isLoggedIn, async (req: Request, res: Response) => {
    const { videoId }: typeof req.params = req.params;
    const user: Express.User = req.user as Express.User;
    try {
        const video: Video | null = await DB.prisma.video.findFirst({
            where: {
                id: videoId,
                deletedAt: null,
            },
        });
        if (!video || video.deletedAt !== null || video.uploader !== user.userId) {
            return res.status(403).json({
                info: '/video/delete/:videoId not exists video or not permissioned user',
            });
        }
        await DB.prisma.video.delete({
            where: {
                uploader_id: {
                    uploader: video.uploader,
                    id: video.id,
                },
            },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/video/:videoId/delete router error',
        });
    }
});

router.get('/:userId/list', async (req: Request, res: Response) => {
    const { userId }: typeof req.params = req.params;
    try {
        const videos: Video[] = await DB.prisma.video.findMany({
            where: {
                uploader: userId,
                deletedAt: null,
            },
        });
        return res.status(200).json({
            videos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/video/:userId/list router error',
        });
    }
});

export default router;
