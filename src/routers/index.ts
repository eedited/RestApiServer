import { Request, Response, NextFunction, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const a: number = 3;
    console.log(a);
    res.send('hello typescript express!!');
});

export default router;
