import {APIError} from '../../../src/components/helpers/APIError';
import {HTTPRequestError} from '../../../src/components/httprequest/HTTPRequestError';

describe('A HTTPRequestError', () => {
  it('Can return a response body', () => {
    const error = new HTTPRequestError('Error');
    const body  = error.toResponseBody();

    expect(error.statusCode).toEqual(500);
    expect(error.name).toEqual('HTTPRequestError');
    expect(error.stack).toBeDefined();

    expect(body.error).toEqual('HTTPRequestError');
    expect(body.message).toEqual('Error');
    expect(body.stack).not.toBeDefined();

    expect(error instanceof Error).toEqual(true);
    expect(error instanceof APIError).toEqual(true);
    expect(error instanceof HTTPRequestError).toEqual(false);
  });
});