import { Request, Response, Router } from 'express';
import { User, Video, Follower } from '@prisma/client';
import sendEmail from '../services/sendEmail';
import { isLoggedIn, isAdmin, isNotBlock } from '../middlewares/auth';
import DB from '../db';

const router: Router = Router();

router.get('/', isLoggedIn, isAdmin, async (req: Request, res: Response) => {
    try {
        const users: (User[] | null) = await DB.prisma.user.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                nickname: 'asc',
            },
        });
        return res.status(200).json({
            users,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/ router error',
        });
    }
});

router.get('/:userId/like', async (req: Request, res: Response) => {
    const { userId }: typeof req.params = req.params;
    try {
        const likeing: { videoId: string; }[] = await DB.prisma.videoLiker.findMany({
            where: {
                liker: userId,
                deletedAt: null,
            },
            select: {
                videoId: true,
            },
        });
        const likeingVideo: Promise<Video | null>[] = likeing.map(async (value: { videoId: string; }) => {
            try {
                const video: Video | null = await DB.prisma.video.findFirst({
                    where: {
                        id: value.videoId,
                        deletedAt: null,
                    },
                });
                return video;
            }
            catch (err) {
                return null;
            }
        });
        const videos: (Video | null)[] = await Promise.all(likeingVideo);
        return res.status(200).json({
            videos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/:userId/like router error',
        });
    }
});

router.get('/:userId/follow', async (req: Request, res: Response) => {
    const { userId }: typeof req.params = req.params;
    try {
        const following: { followingId: string; }[] = await DB.prisma.follower.findMany({
            where: {
                followerId: userId,
                deletedAt: null,
            },
            select: {
                followingId: true,
            },
        });
        const followingUser: Promise<User | null>[] = following.map(async (value: { followingId: string; }) => {
            try {
                const user: User | null = await DB.prisma.user.findFirst({
                    where: {
                        userId: value.followingId,
                        deletedAt: null,
                    },
                });
                return user;
            }
            catch (err) {
                return null;
            }
        });
        const users: (User | null)[] = await Promise.all(followingUser);
        return res.status(200).json({
            users,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/:userId/follow router error',
        });
    }
});

router.patch('/:userId/follow', isLoggedIn, isNotBlock, async (req: Request, res: Response) => {
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

router.post('/exist', async (req: Request, res: Response) => {
    const { userId }: typeof req.body = req.body;
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
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/exist - Error',
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
                info: `/user/${userId} user not found - EC101`,
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
        // 팔로워 구하기
        const following: { followingId: string; }[] = await DB.prisma.follower.findMany({
            where: {
                followerId: userId,
                deletedAt: null,
            },
            select: {
                followingId: true,
            },
        });
        const followingUser: Promise<User | null>[] = following.map(async (value: { followingId: string; }) => {
            try {
                const follow: User | null = await DB.prisma.user.findFirst({
                    where: {
                        userId: value.followingId,
                        deletedAt: null,
                    },
                });
                return follow;
            }
            catch (err) {
                return null;
            }
        });
        const followers: (User | null)[] = await Promise.all(followingUser);
        // 좋아요 동영상 구하기
        const likeing: { videoId: string; }[] = await DB.prisma.videoLiker.findMany({
            where: {
                liker: userId,
                deletedAt: null,
            },
            select: {
                videoId: true,
            },
        });
        const likeingVideo: Promise<Video | null>[] = likeing.map(async (value: { videoId: string; }) => {
            try {
                const video: Video | null = await DB.prisma.video.findFirst({
                    where: {
                        id: value.videoId,
                        deletedAt: null,
                    },
                });
                return video;
            }
            catch (err) {
                return null;
            }
        });
        const likeVideos: (Video | null)[] = await Promise.all(likeingVideo);
        return res.status(200).json({
            ...userInfo,
            categories,
            followers,
            likeVideos,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: `/user/${userId} router error`,
        });
    }
});

router.patch('/change', isLoggedIn, isNotBlock, async (req: Request, res: Response) => {
    const { description, nickname, profilePicture }: typeof req.body = req.body;
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
                profilePicture,
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

router.patch('/change/sns', isLoggedIn, isNotBlock, async (req: Request, res: Response) => {
    const { facebook, instagram, linkedin, twitter }: typeof req.body = req.body;
    const user: Express.User = req.user as Express.User;
    try {
        await DB.prisma.user.update({
            where: {
                userId: user.userId,
            },
            data: {
                facebook,
                instagram,
                linkedin,
                twitter,
            },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/change/sns router error',
        });
    }
});

router.patch('/block', isLoggedIn, isAdmin, async (req: Request, res: Response) => {
    const userId: string = req.query.userId as string;
    try {
        await DB.prisma.user.update({
            where: {
                userId,
            },
            data: {
                block: true,
            },
        });
        return res.status(200).json({});
    }
    catch (err) {
        return res.status(500).json({
            info: '/user/block?userId= router error',
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
            sendEmail('answeqr@gmail.com', emailTitle, description),
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

export default router;
