import { PrismaClient } from '@prisma/client';
import { Prisma } from '.prisma/client';

export default class DB {
    public static prisma: PrismaClient = new PrismaClient()
}

type nextType = (params: Prisma.MiddlewareParams) => Promise<unknown>;

DB.prisma.$use(async (params: Prisma.MiddlewareParams, next: nextType) => {
    if (params.model === 'Video') {
        if (params.action === 'create') {
            await DB.prisma.user.update({
                where: {
                    userId: params.args.data.uploader,
                },
                data: {
                    uploadVideoCnt: { increment: 1 },
                },
            });
        }
        else if (params.action === 'delete') {
            await DB.prisma.user.update({
                where: {
                    userId: params.args.where.uploader_id.uploader,
                },
                data: {
                    uploadVideoCnt: { decrement: 1 },
                },
            });
        }
    }
    else if (params.model === 'VideoLiker') {
        if (params.action === 'create') {
            await DB.prisma.video.update({
                where: {
                    uploader_id: {
                        id: params.args.data.videoId,
                        uploader: params.args.data.uploader,
                    }
                },
                data: {
                    likeCnt: { increment: 1 },
                },
            });
        }
        else if (params.action === 'update') {
            if (params.args.data.deleted === null){
                await DB.prisma.video.update({
                    where: {
                        uploader_id: {
                            id: params.args.where.uploader_userId_videoId.videoId,
                            uploader: params.args.where.uploader_userId_videoId.uploader,
                        }
                    },
                    data: {
                        likeCnt: { increment: 1 },
                    },
                });
            }
            else {
                await DB.prisma.video.update({
                    where: {
                        uploader_id: {
                            id: params.args.where.uploader_userId_videoId.videoId,
                            uploader: params.args.where.uploader_userId_videoId.uploader,
                        }
                    },
                    data: {
                        likeCnt: { decrement: 1 },
                    },
                });
                console.log(5);
            }
        }
    }
    return next(params);
});

// for Video softdelete
DB.prisma.$use(async (params: Prisma.MiddlewareParams, next: nextType) => {
    // Check incoming query type
    if (params.model == 'Video') {
        if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update'
            params.args['data'] = { deleted: new Date() }
        }
        if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany'
            if (params.args.data != undefined) {
                params.args.data['deleted'] = true;
            } 
            else {
                params.args['data'] = { deleted: new Date() }
            }
        }
    }
    return next(params)
})

// for User softdelete
DB.prisma.$use(async (params: Prisma.MiddlewareParams, next: nextType) => {
    // Check incoming query type
    if (params.model == 'User') {
        if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update'
            params.args['data'] = { deleted: new Date() }
        }
    }
    return next(params)
})
