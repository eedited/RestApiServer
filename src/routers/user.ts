import { Request, Response, Router } from 'express';
import { User, Video, Follower } from '@prisma/client';
import sendEmail from '../services/sendEmail';
import { isLoggedIn } from '../middlewares/auth';
import DB from '../db';

const router: Router = Router();

router.patch('/:userId/follow', isLoggedIn, async (req: Request, res: Response) => {
    const { userId }: typeof req.params = req.params;
    const user: Express.User = req.user as Express.User;
    try {
        const finduser: (User | null) = await DB.prisma.user.findFirst({
            where: {
                userId,
                deletedAt: null,
            },
        });
        if (!finduser) {
            return res.status(404).json({
                info: '/:userId/like user not found',
            });
        }
        const follow: (Follower | null) = await DB.prisma.follower.findFirst({
            where: {
                followerId: user.userId,
                followingId: userId,
            },
        });
        if (!follow) {
            await DB.prisma.follower.create({
                data: {
                    followerId: user.userId,
                    followingId: userId,
                },
            });
        }
        else if (!follow.deletedAt) {
            await DB.prisma.follower.update({
                where: {
                    followerId_followingId: {
                        followerId: user.userId,
                        followingId: userId,
                    },
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        }
        else {
            await DB.prisma.follower.update({
                where: {
                    followerId_followingId: {
                        followerId: user.userId,
                        followingId: userId,
                    },
                },
                data: {
                    deletedAt: null,
                },
            });
        }
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: `/user/${userId}/follow router error`,
        });
    }
});

router.get('/:userId', async (req: Request, res: Response) => {
    const { userId }: typeof req.params = req.params;
    const { user }: Request = req;
    try {
        let userInfo: (User & { Video: (Video & { WhatVideoUpload: { liker: string; }[]; })[]; followFrom: { followingId: string; }[]; followTo: { followerId: string; }[]; }) | (User & { followFrom: { followingId: string; }[]; Video: Video[]; }) | null;
        if (user) {
            userInfo = await DB.prisma.user.findFirst({
                where: {
                    userId,
                    deletedAt: null,
                },
                include: {
                    Video: {
                        where: {
                            uploader: userId,
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
                        },
                    },
                    followFrom: {
                        where: {
                            followerId: userId,
                            deletedAt: null,
                        },
                        select: {
                            followingId: true,
                        },
                    },
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
            });
        }
        else {
            userInfo = await DB.prisma.user.findFirst({
                where: {
                    userId,
                    deletedAt: null,
                },
                include: {
                    Video: {
                        where: {
                            uploader: userId,
                            deletedAt: null,
                        },
                    },
                    followFrom: {
                        where: {
                            followerId: userId,
                            deletedAt: null,
                        },
                        select: {
                            followingId: true,
                        },
                    },
                },
            });
        }
        if (!userInfo) {
            return res.status(404).json({
                info: `/user/${userId} user not found`,
            });
        }
        const categories: {
            [key: string]: number;
        } = userInfo.Video
            .map((video: Video) => video.category)
            .reduce((acc: {[key: string]: number}, val: string | null) => {
                const x: string = val === null ? 'etc' : val;
                acc[x] = (acc[x] || 0) + 1;
                return acc;
            }, {});
        return res.status(200).json({
            ...userInfo,
            categories,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: `/user/${userId} router error`,
        });
    }
});

export default router;

router.patch('/change', isLoggedIn, async (req: Request, res: Response) => {
    const { description, nickname }: typeof req.body = req.body;
    const user: Express.User = req.user as Express.User;
    try {
        if (user.nickname !== nickname) { // nickname이 변경되었을 때.
            const nicknamePromise: Promise<User | null> = DB.prisma.user.findFirst({ where: { nickname, deletedAt: null } });
            const duplicateUser: (User|null) = await nicknamePromise;
            if (duplicateUser) {
                return res.status(404).json({
                    info: '/user/change - DB : exists User of (nickname)',
                });
            }
        }
        await DB.prisma.user.update({
            where: {
                userId: user.userId,
            },
            data: {
                description,
                nickname,
            },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/change router error',
        });
    }
});

router.post('/discomfort', isLoggedIn, async (req: Request, res: Response) => {
    const { title, description }: {title: string, description: string} = req.body;
    const { user }: Request = req;
    try {
        const emailTitle: string = `user:${user?.userId} title : ${title}`;
        const emailPromise: Promise<string>[] = [
            sendEmail('minsu2530@u.sogang.ac.kr', emailTitle, description),
            sendEmail('tjdnf2eoeld@gmail.com', emailTitle, description),
            sendEmail('rldnd913@gmail.com', emailTitle, description),
        ];
        await Promise.all(emailPromise);
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/discomfort - nodemaileError',
        });
    }
});
