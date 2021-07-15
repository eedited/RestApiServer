import express from 'express';

declare global {
    type expressRouter = (req: express.Request, res: express.Response, next: express.NextFunction) => void;
    type expressMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => (void);
}
