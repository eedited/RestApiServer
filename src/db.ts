import { PrismaClient } from '@prisma/client';

export default class DB {
    public static prisma: PrismaClient = new PrismaClient()
}
