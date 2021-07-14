declare namespace Express {
    export interface Request {
        body: {
            id: string,
            password: string
        }
    }
}
