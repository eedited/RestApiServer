import { Request, Response, NextFunction, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello typescript express!!');
});

export default router;
