import {HTTPRequest, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';
import {RetryableHTTPRequest} from '../../../src/components/httprequest/RetryableHTTPRequest';

describe('A RetryableHTTPRequest', () => {
  let requestResult: HTTPRequestResponse;
  const httpRequestMock = {
    options: {
      body: {},
    },
  } as HTTPRequest;

  let retryableRequest: RetryableHTTPRequest;

  beforeEach(() => {
    requestResult           = {
      statusCode: 200,
      headers:    {},
      body:       {},
    };
    httpRequestMock.execute = () => Promise.resolve(requestResult);
    retryableRequest        = new RetryableHTTPRequest(httpRequestMock);
  });

  it('Should be able to succeed an attempt', async () => {
    const attempt = await retryableRequest.attempt();
    const result  = await retryableRequest.execute();

    expect(attempt).toEqual(true);
    expect(result).toEqual(requestResult);
  });

  it('Should retry a statuscode 5**', async () => {
    requestResult = {
      statusCode: 500,
      headers:    {},
      body:       {},
    };

    const attempt = await retryableRequest.attempt();
    const result  = await retryableRequest.execute();

    expect(attempt).toEqual(false);
    expect(result).toEqual(requestResult);
  });

  it('Should not retry a SocketTimedOut', async () => {
    httpRequestMock.execute = () => {
      throw new Error('Error: ESOCKETTIMEDOUT');
    };

    const attempt = await retryableRequest.attempt();

    expect(attempt).toEqual(true);

    try {
      await retryableRequest.execute();
    } catch (error) {
      expect(error.message).toEqual('Error: ESOCKETTIMEDOUT');

      return;
    }

    fail();
  });

  it('Should retry a TimedOut', async () => {
    httpRequestMock.execute = () => {
      throw new Error('Error: ETIMEDOUT');
    };

    const attempt = await retryableRequest.attempt();

    expect(attempt).toEqual(false);

    try {
      await retryableRequest.execute();
    } catch (error) {
      expect(error.message).toEqual('Error: ETIMEDOUT');

      return;
    }

    fail();
  });

  it('Should throw an error when no attempt was made', async () => {
    retryableRequest = new RetryableHTTPRequest(httpRequestMock);

    try {
      await retryableRequest.execute();
    } catch (error) {
      expect(error.message).toEqual('No attempt has been made for retryable request');

      return;
    }

    fail();
  });

  it('Should be able to return options', () => {
    const logOptions = retryableRequest.getLogInformation();

    expect(logOptions).toEqual(httpRequestMock.options);
  });

  it('Should be able to create tags without removing option parameters', () => {
    const tags = retryableRequest.tags;

    expect(tags).toEqual(['result:noattempt']);
    expect(Object.keys(retryableRequest.options)).toContain('body');
  });
});