import {HTTPRequestMeasurable} from '../../../src/components/httprequest/HTTPRequestMeasurable';
import {HTTPRequest, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';

describe('A HTTPRequestMeasurable', () => {
  let httpRequestMock: HTTPRequest;
  let tags: string[];
  let response: HTTPRequestResponse;

  beforeEach(() => {
    httpRequestMock = {
      options: {
        url: '/v2/products',
      },
    } as HTTPRequest;
  });

  describe('With 200 response', () => {
    const mockResponse = {
      statusCode: 200,
      headers:    {},
      body:       {},
    };

    beforeEach(async () => {
      const request           = new HTTPRequestMeasurable(httpRequestMock);
      httpRequestMock.execute = () => Promise.resolve(mockResponse);

      response = await request.execute();

      tags = request.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('statuscode:200');
      expect(tags).toContain('url:/v2/products');
      expect(tags).toContain('method:get');
      expect(tags).toContain('result:success');
    });

    it('Returns the same response', () => {
      expect(response).toBe(mockResponse);
    });
  });

  describe('With a 400 response', () => {
    const mockResponse = {
      statusCode: 400,
      headers:    {},
      body:       {},
    };

    beforeEach(async () => {
      const request           = new HTTPRequestMeasurable(httpRequestMock);
      httpRequestMock.execute = () => Promise.resolve(mockResponse);

      response = await request.execute();

      tags = request.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('result:client_error');
    });
  });

  describe('With a 500 response', () => {
    const mockResponse = {
      statusCode: 500,
      headers:    {},
      body:       {},
    };

    beforeEach(async () => {
      const request           = new HTTPRequestMeasurable(httpRequestMock);
      httpRequestMock.execute = () => Promise.resolve(mockResponse);

      response = await request.execute();

      tags = request.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('result:server_error');
    });
  });

  describe('With a unknown response', () => {
    const mockResponse = {
      statusCode: 300,
      headers:    {},
      body:       {},
    };

    beforeEach(async () => {
      const request           = new HTTPRequestMeasurable(httpRequestMock);
      httpRequestMock.execute = () => Promise.resolve(mockResponse);

      response = await request.execute();

      tags = request.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('result:redirection');
    });
  });

  describe('When an error is thrown', () => {
    let error: unknown;
    const throwError = new Error();

    beforeEach(async () => {
      const request           = new HTTPRequestMeasurable(httpRequestMock);
      httpRequestMock.execute = () => Promise.reject(throwError);

      await request.execute().catch((e) => {
        error = e;
      });

      tags = request.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('result:failed');
    });

    it('Error to be thrown', () => {
      expect(error).toBe(throwError);
    });
  });

  describe('With a baseURL', () => {
    const mockResponse = {
      statusCode: 200,
      headers:    {},
      body:       {},
    };

    beforeEach(async () => {
      httpRequestMock.options.baseUrl = 'http://baseurl';

      const request           = new HTTPRequestMeasurable(httpRequestMock);
      httpRequestMock.execute = () => Promise.resolve(mockResponse);

      response = await request.execute();

      tags = request.tags;
    });

    it('Has correct tags', () => {
      expect(tags).toContain('baseurl:http://baseurl');
    });
  });
});