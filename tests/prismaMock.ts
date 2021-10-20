import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';

import DB from '../src/db';

jest.mock('../src/db', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

export const prismaMock: DeepMockProxy<PrismaClient> = DB.prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
    mockReset(prismaMock);
});
