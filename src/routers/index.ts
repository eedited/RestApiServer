import { Request, Response, NextFunction, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const a: number = 3;
    console.log(a);
    return res.send('hello typescript express!!');
});

import { PrismaClient, User } from '@prisma/client';

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
    const prisma: PrismaClient = new PrismaClient();
    //

    const nu: User = await prisma.user.create({
        data: {
            email: '123',
            password: '2222',
        },
    });

    return res.send(nu);
});

export default router;
