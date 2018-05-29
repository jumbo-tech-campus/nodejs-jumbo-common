import {HTTPRequestError} from '../../../src/components/httprequest/HTTPRequestError';
import {APIError} from '../../../src/components/helpers/APIError';

describe('A HTTPRequestError', () => {
  it('Can return a response body', () => {
    const error = new HTTPRequestError('Error');
    const body = error.toResponseBody('tid', false);
    const bodyWithStack = error.toResponseBody('tid', true);

    expect(error.statusCode).toEqual(500);
    expect(error.name).toEqual('HTTPRequestError');
    expect(error.stack).toBeDefined();

    expect(body.name).toEqual('HTTPRequestError');
    expect(body.message).toEqual('Error');
    expect(body.tid).toEqual('tid');
    expect(body.stack).not.toBeDefined();
    expect(bodyWithStack.stack).toBeDefined();

    expect(error instanceof Error).toEqual(true);
    expect(error instanceof APIError).toEqual(true);
    expect(error instanceof HTTPRequestError).toEqual(false); // TODO: Should work as well
  });
});