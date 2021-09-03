import { Request, Response, Router } from 'express';
import { User, Video, VideoTag, Follower } from '@prisma/client';
import { takeCoverage } from 'v8';
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
    try {
        const user: (User & { Video: (Video & { WhoVideoUploadTag: { tagName: string; }[]; })[]; followFrom: { followingId: string; }[]; }) | null = await DB.prisma.user.findFirst({
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
                        WhoVideoUploadTag: {
                            where: {
                                uploader: userId,
                                deletedAt: null,
                            },
                            select: {
                                tagName: true,
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
            },
        });
        if (!user) {
            return res.status(404).json({
                info: `/user/${userId} user not found`,
            });
        }
        const tags: {[key: string]: number} = user.Video
            .map((video: (Video & { WhoVideoUploadTag: { tagName: string; }[]; })) => video.WhoVideoUploadTag)
            .reduce((acc: {tagName: string;}[], tag: {tagName: string;}[]) => [...acc, ...tag], [])
            .map((tag: {tagName: string;}) => tag.tagName)
            .reduce((acc: {[key: string]: number}, tag: string) => {
                acc[tag] = (acc[tag] || 0) + 1;
                return acc;
            }, {});
        return res.status(200).json({
            ...user,
            tags,
        });
    }
    catch (err) {
        return res.status(500).json({
            info: `/user/${userId} router error`,
        });
    }
});

export default router;
