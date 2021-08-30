import { Request, Response, Router } from 'express';
import { prisma, User, Video, VideoLiker, VideoTag } from '@prisma/client';
import { isLoggedIn } from '../middlewares/auth';
import DB from '../db';

const router: Router = Router();
const take: number = 20;

router.get('/', async (req: Request, res: Response) => {
    const pageStr: string = req.query.page as string;
    const { user }: Request = req;
    try {
        const pageNum: number = Number(pageStr);
        if (Number.isNaN(pageNum)) {
            return res.status(400).json({
                info: `/video/${pageStr} not valid input`,
            });
        }
        let videos: (Video&{WhatVideoUpload?: {liker: string}[], User: {nickname: string}})[];
        if (user) {
            videos = await DB.prisma.video.findMany({
                where: { deletedAt: null },
                skip: (pageNum - 1) * take,
                take,
                include: {
                    WhatVideoUpload: {
                        where: {
                            liker: user.userId,
                            deletedAt: null,
                        },
                        select: {
                            liker: true,
                        },
                    },
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
        else {
            videos = await DB.prisma.video.findMany({
                where: { deletedAt: null },
                skip: (pageNum - 1) * take,
                take,
                include: {
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
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
    const pageStr: string = req.query.page as string;
    const { user }: Request = req;
    try {
        const pageNum: number = Number(pageStr);
        if (Number.isNaN(pageNum)) {
            return res.status(400).json({
                info: `/video/${pageStr} not valid input`,
            });
        }
        let videos: (Video&{WhatVideoUpload?: {liker: string}[], User: {nickname: string}})[];
        if (user) {
            videos = await DB.prisma.video.findMany({
                where: { deletedAt: null },
                skip: (pageNum - 1) * take,
                orderBy: { createdAt: 'desc' },
                take,
                include: {
                    WhatVideoUpload: {
                        where: {
                            liker: user.userId,
                            deletedAt: null,
                        },
                        select: {
                            liker: true,
                        },
                    },
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
        else {
            videos = await DB.prisma.video.findMany({
                where: { deletedAt: null },
                skip: (pageNum - 1) * take,
                orderBy: { createdAt: 'desc' },
                take,
                include: {
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
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
    const pageStr: string = req.query.page as string;
    const { user }: Request = req;
    try {
        const pageNum: number = Number(pageStr);
        if (Number.isNaN(pageNum)) {
            return res.status(400).json({
                info: `/video/${pageStr} not valid input`,
            });
        }
        let videos: (Video&{WhatVideoUpload?: {liker: string}[], User: {nickname: string}})[];
        if (user) {
            videos = await DB.prisma.video.findMany({
                where: { deletedAt: null },
                skip: (pageNum - 1) * take,
                orderBy: { likeCnt: 'desc' },
                take,
                include: {
                    WhatVideoUpload: {
                        where: {
                            liker: user.userId,
                            deletedAt: null,
                        },
                        select: {
                            liker: true,
                        },
                    },
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
        else {
            videos = await DB.prisma.video.findMany({
                where: { deletedAt: null },
                skip: (pageNum - 1) * take,
                orderBy: { likeCnt: 'desc' },
                take,
                include: {
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }

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
    const { title, discription, url, thumbnail, tags }: Video&{tags: string[]} = req.body;
    const user: Express.User = req.user as Express.User;
    try {
        const uploadedVideo: Video = await DB.prisma.video.create({
            data: {
                title,
                discription,
                url,
                thumbnail,
                uploader: user.userId,
            },
        });
        const tagData: {
            uploader: string;
            videoId: string;
            tagName: string;
        }[] = tags.map((tag: string) => ({
            uploader: uploadedVideo.uploader,
            videoId: uploadedVideo.id,
            tagName: tag,
        }));
        await DB.prisma.videoTag.createMany({
            data: tagData,
            skipDuplicates: true,
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
    const { user }: Request = req;
    try {
        let video: ((Video&{User: {nickname: string}}&{WhatVideoUpload?: {liker: string}[]}&{WhatVideoUploadTag?: {tagName: string}[]})| null);
        if (user) {
            video = await DB.prisma.video.findFirst({
                where: {
                    id: videoId,
                    deletedAt: null,
                },
                include: {
                    WhatVideoUpload: {
                        where: {
                            liker: user.userId,
                            deletedAt: null,
                        },
                        select: {
                            liker: true,
                        },
                    },
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                    WhatVideoUploadTag: {
                        select: {
                            tagName: true,
                        },
                    },
                },
            });
        }
        else {
            video = await DB.prisma.video.findFirst({
                where: {
                    id: videoId,
                    deletedAt: null,
                },
                include: {
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                    WhatVideoUploadTag: {
                        select: {
                            tagName: true,
                        },
                    },
                },
            });
        }
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
            ...video,
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
    const { user }: Request = req;
    const pageStr: string = req.query.page as string;
    try {
        const pageNum: number = Number(pageStr);
        if (Number.isNaN(pageNum)) {
            return res.status(400).json({
                info: `/video/${pageStr} not valid input`,
            });
        }
        let videos: (Video&{WhatVideoUpload?: {liker: string}[], User: {nickname: string}})[];
        if (user) {
            videos = await DB.prisma.video.findMany({
                where: {
                    uploader: userId,
                    deletedAt: null,
                },
                skip: (pageNum - 1) * take,
                take,
                include: {
                    WhatVideoUpload: {
                        where: {
                            liker: user.userId,
                            deletedAt: null,
                        },
                        select: {
                            liker: true,
                        },
                    },
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
        else {
            videos = await DB.prisma.video.findMany({
                where: {
                    uploader: userId,
                    deletedAt: null,
                },
                skip: (pageNum - 1) * take,
                take,
                include: {
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
            });
        }
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
