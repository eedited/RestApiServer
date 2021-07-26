import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const resMessage: string = 'hello world';
    return res.send(resMessage);
});

export default router;
