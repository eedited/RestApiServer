import { Request, Response, NextFunction } from 'express';

export const isLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const isNotLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
};
