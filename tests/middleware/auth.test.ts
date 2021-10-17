import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { User } from '@prisma/client';
import { StringParameterList } from 'aws-sdk/clients/quicksight';
import { isLoggedIn, isNotLoggedIn, checkPassword } from '../../src/middlewares/auth';
import { prismaMock } from '../prismaMock';

jest.mock('express');

describe('isLoggedIn', () => {
    const res: MockResponse = mockResponse({});
    const next: () => void = jest.fn();
    test('로그인이 되어있으면 isLoggedIn이 next를 호출해야 함', () => {
        const req: MockRequest = mockRequest({
            isAuthenticated: jest.fn(() => true),
        });
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인이 되어있지 않으면 isLoggedIn이 403에러를 응답해야 함', () => {
        const req: MockRequest = mockRequest({
            isAuthenticated: jest.fn(() => false),
        });
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.json).toBeCalledWith({
            info: 'Login Required',
        });
    });
});

describe('isNotLoggedIn', () => {
    const res: MockResponse = mockResponse({});
    const next: () => void = jest.fn();
    test('로그인이 되어있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req: MockRequest = mockRequest({
            isAuthenticated: jest.fn(() => false),
        });
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인이 되어있으면 isNotLoggedIn이 403에러를 응답해야 함', () => {
        const req: MockRequest = mockRequest({
            isAuthenticated: jest.fn(() => true),
        });
        isNotLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.json).toBeCalledWith({
            info: 'Account is already logged in',
        });
    });
});

describe('checkPassword', () => {
    const res: MockResponse = mockResponse({});
    const next: () => void = jest.fn();
    interface CreateUser {
        userId: string
        password: string
        nickname: string
        email: string
        emailToken: string
        profilePicture: string
        description: string
    }
    const testUser: createUser = {
        userId: 'test',
        password: 'test',
        nickname: 'test',
        email: 'test',
        emailToken: 'test',
        profilePicture: 'test',
        description: 'test',
    } as User;
    test('로그인되지 않았다면 404 not found', async () => {
        const req: MockRequest = mockRequest({});
        await checkPassword(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toBeCalledWith({
            info: 'there is no user',
        });
    });
    test('비밀번호가 일치한다면 next를 호출', async () => {
        prismaMock.user.create.mockResolvedValue(testUser);
        const req: MockRequest = mockRequest({
            user: testUser,
        });
        console.log(req.user);
        await checkPassword(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});
