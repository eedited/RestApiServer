import { Request, Response, Router } from 'express';
import { User, Video } from '@prisma/client';
import DB from '../db';

const router: Router = Router();
const videoTake: number = 20;
const userTake: number = 4;

router.get('/', async (req: Request, res: Response) => {
    const toFind: string = req.query.toFind as string;
    const pageStr: string = req.query.page as string;
    const { user }: Request = req;
    try {
        const pageNum: number = Number(pageStr);
        if (Number.isNaN(pageNum)) {
            return res.status(400).json({
                info: '/search/ page not valid input',
            });
        }
        let users: User[] | (User & { followTo: { followerId: string; }[]; })[];
        let videos: (Video&{WhatVideoUpload?: {liker: string}[], User: {nickname: string}})[];
        if (user) {
            users = await DB.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            deletedAt: null,
                        },
                        {
                            OR: [
                                {
                                    nickname: {
                                        contains: toFind,
                                    },
                                },
                                {
                                    description: {
                                        contains: toFind,
                                    },
                                },
                            ],
                        },
                    ],
                },
                include: {
                    followTo: {
                        where: {
                            followerId: user.userId,
                            deletedAt: null,
                        },
                        select: {
                            followerId: true,
                        },
                    },
                },
                orderBy: { followerCnt: 'desc' },
                skip: (pageNum - 1) * userTake,
                take: userTake,
            });
            videos = await DB.prisma.video.findMany({
                where: {
                    AND: [
                        {
                            deletedAt: null,
                        },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: toFind,
                                    },
                                },
                                {
                                    description: {
                                        contains: toFind,
                                    },
                                },
                                {
                                    WhatVideoUploadTag: {
                                        some: {
                                            tagName: {
                                                contains: toFind,
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
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
                },
                orderBy: { likeCnt: 'desc' },
                skip: (pageNum - 1) * videoTake,
                take: videoTake,
            });
        }
        else {
            users = await DB.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            deletedAt: null,
                        },
                        {
                            OR: [
                                {
                                    nickname: {
                                        contains: toFind,
                                    },
                                },
                                {
                                    description: {
                                        contains: toFind,
                                    },
                                },
                            ],
                        },
                    ],
                },
                orderBy: { followerCnt: 'desc' },
                skip: (pageNum - 1) * userTake,
                take: userTake,
            });
            videos = await DB.prisma.video.findMany({
                where: {
                    AND: [
                        {
                            deletedAt: null,
                        },
                        {
                            OR: [
                                {
                                    title: {
                                        contains: toFind,
                                    },
                                },
                                {
                                    description: {
                                        contains: toFind,
                                    },
                                },
                                {
                                    WhatVideoUploadTag: {
                                        some: {
                                            tagName: {
                                                contains: toFind,
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                include: {
                    User: {
                        select: {
                            nickname: true,
                        },
                    },
                },
                orderBy: { likeCnt: 'desc' },
                skip: (pageNum - 1) * videoTake,
                take: videoTake,
            });
        }
        return res.status(200).json({
            users,
            videos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/search/ router error',
        });
    }
});

export default router;
