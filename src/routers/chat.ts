import { Request, Response, NextFunction, Router } from 'express';
import { User, ChatParticipant, Chat } from '@prisma/client';
import { Chatroom, Prisma } from '.prisma/client';
import DB from '../db';

const router: Router = Router();

router.post('/list', async (req: Request, res: Response) => {
    const { userId }: User = req.body;
    try {
        const result: ChatParticipant[] = await DB.prisma.chatParticipant.findMany({
            where: {
                userId,
            },
        });
        const chatroomList: string[] = result.map((value: ChatParticipant) => value.chatroomId);
        return res.status(200).json({
            success: true,
            chatroomList,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

router.get('/:chatroomId', async (req: Request, res: Response) => {
    const { chatroomId }: typeof req.params = req.params;
    try {
        // check valid chatroomId
        const find: Chatroom | null = await DB.prisma.chatroom.findUnique({
            where: {
                id: chatroomId,
            },
        });
        if (!find) {
            return res.status(501).json({
                success: false,
                error: 'not exists chatroom',
            });
        }

        // check user is participant
        const user: ChatParticipant[] = await DB.prisma.chatParticipant.findMany({
            where: {
                chatroomId,
            },
        });

        // get chatting logs
        const result: Chat[] = await DB.prisma.chat.findMany({
            where: {
                chatroomId,
            },
        });
        const log: string[] = result.map((value: Chat) => value.message);
        return res.status(200).json({
            success: true,
            log,
        });
    }
    catch (err) {
        return res.status(501).json({
            success: false,
        });
    }
});

export default router;
