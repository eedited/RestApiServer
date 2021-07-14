import express from 'express';

export const isLoggedIn: expressMiddleware = (req: Express.Request, res: express.Response, next: express.NextFunction) => {
    next();
};

export const isNotLoggedIn: expressMiddleware = (req: Express.Request, res: express.Response, next: express.NextFunction) => {
    next();
};
