import prisma from '@prisma/client';

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface User extends prisma.User {}
    }
}
