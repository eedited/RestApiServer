import { Request, Response, NextFunction } from 'express';

export const isLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    }
    return res.status(403).json({
        info: 'Login Required',
    });
};

export const isNotLoggedIn: expressMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next();
    }
    return res.status(403).json({
        info: 'Account is already logged in',
    });
};
