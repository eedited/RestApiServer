/// <reference types="jest" />
import { Response, Request } from 'express';

declare global{
    interface MockResponse extends Response {
        append: jest.Mock;
        attachment: jest.Mock;
        clearCookie: jest.Mock;
        contentType: jest.Mock;
        cookie: jest.Mock;
        download: jest.Mock;
        end: jest.Mock;
        format: jest.Mock;
        get: jest.Mock;
        header: jest.Mock;
        json: jest.Mock;
        jsonp: jest.Mock;
        links: jest.Mock;
        location: jest.Mock;
        redirect: jest.Mock;
        render: jest.Mock;
        send: jest.Mock;
        sendFile: jest.Mock;
        sendStatus: jest.Mock;
        set: jest.Mock;
        status: jest.Mock;
        type: jest.Mock;
        vary: jest.Mock;
    }

    interface MockRequest extends Request {
        accepts: jest.Mock;
        acceptsCharsets: jest.Mock;
        acceptsEncodings: jest.Mock;
        acceptsLanguages: jest.Mock;
        get: jest.Mock;
        header: jest.Mock;
        is: jest.Mock;
        range: jest.Mock;
    }
}
