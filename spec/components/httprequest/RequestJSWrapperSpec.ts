import nock from 'nock';
import {asyncIt} from '../../helpers/JasmineHelper';
import {RequestJSWrapper} from '../../../src/components/httprequest/RequestJSWrapper';
import {HTTPRequestOptions, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';

describe('A RequestJSWrapper', () => {
  const domain  = 'http://mobileapi.unit-test-jumbo.com';
  const url     = 'v2/test/url';
  const nockUrl = `/${url}`;
  const options = {
    url: `${domain}/${url}`,
  } as HTTPRequestOptions;

  asyncIt('Can return a valid HTTPResponse', async () => {
    nock(domain).get(nockUrl).reply(200, {}, {});

    const response = await new RequestJSWrapper(options).execute() as HTTPRequestResponse;

    expect(response.body).toEqual('{}');
    expect(response.headers).toEqual({'content-type': 'application/json'});
  });

  asyncIt('Can return a valid HTTPResponse with JSON body when method is POST', async () => {
    let contentTypeHeader: string | undefined;

    nock(domain).post(nockUrl).reply(200, function (this: any): unknown {
      contentTypeHeader = this.req.headers['content-type'];

      return {};
    });

    const response = await new RequestJSWrapper({
      ...options,
      json:    true,
      method:  'POST',
      body:    {
        thisIsJSON: true,
      },
      headers: {
        'doesthisheader': 'removecontenttypeheader',
      },
    }).execute() as HTTPRequestResponse;

    expect(response.body).toEqual({});
    expect(response.headers).toEqual({'content-type': 'application/json'});
    expect(contentTypeHeader).toEqual('application/json');
  });

  asyncIt('Can return a valid HTTPResponse with JSON body when method is PUT', async () => {
    let contentTypeHeader: string | undefined;

    nock(domain).put(nockUrl).reply(200, function (this: any): unknown {
      contentTypeHeader = this.req.headers['content-type'];

      return {};
    });

    const response = await new RequestJSWrapper({
      ...options,
      json:    true,
      method:  'PUT',
      body:    {
        thisIsJSON: true,
      },
      headers: {
        'doesthisheader': 'removecontenttypeheader',
      },
    }).execute() as HTTPRequestResponse;

    expect(response.body).toEqual({});
    expect(response.headers).toEqual({'content-type': 'application/json'});
    expect(contentTypeHeader).toEqual('application/json');
  });

  asyncIt('Can return a 4** valid HTTPResponse with JSON body', async () => {
    nock(domain).get(nockUrl).reply(400, {}, {});

    const response = await new RequestJSWrapper({
      ...options,
      json: true,
    }).execute() as HTTPRequestResponse;

    expect(response.body).toEqual({});
    expect(response.headers).toEqual({'content-type': 'application/json'});
  });

  asyncIt('Can return an invalid HTTPResponse with ESOCKETTIMEDOUT', async () => {
    nock(domain).get(nockUrl).delay(100).reply(200, {}, {});

    try {
      await new RequestJSWrapper({
        ...options,
        timeout: 1,
      }).execute();
    } catch (error) {
      expect(error.name).toEqual('RequestError');
      expect(error.message).toEqual('Error: ESOCKETTIMEDOUT');

      return;
    }

    fail();
  });

  asyncIt('Can return an invalid HTTPResponse with ETIMEDOUT', async () => {
    nock(domain).get(nockUrl).replyWithError('ETIMEDOUT');

    try {
      await new RequestJSWrapper(options).execute();
    } catch (error) {
      expect(error.name).toEqual('RequestError');
      expect(error.message).toEqual('Error: ETIMEDOUT');

      return;
    }

    fail();
  });

  asyncIt('Can return an invalid HTTPResponse with CUSTOM error', async () => {
    nock(domain).get(nockUrl).replyWithError('CUSTOM');

    try {
      await new RequestJSWrapper(options).execute();
    } catch (error) {
      expect(error.name).toEqual('RequestError');
      expect(error.message).toEqual('Error: CUSTOM');

      return;
    }

    fail();
  });

  asyncIt('Can return an ECONNREFUSED error', async () => {
    try {
      await new RequestJSWrapper({
        url: 'http://localhost:12345',
      }).execute();
    } catch (error) {
      expect(error.name).toEqual('RequestError');
      expect(error.message).toEqual('Error: connect ECONNREFUSED 127.0.0.1:12345');

      return;
    }

    fail();
  });

  asyncIt('Can use a baseURL', async () => {
    nock(domain).get(nockUrl).reply(200, {}, {});

    const result = await new RequestJSWrapper({
      baseUrl: domain,
      url:     `/${url}`,
    }).execute();

    expect(result).toEqual({
      statusCode: 200,
      body:       '{}',
      headers:    {
        'content-type': 'application/json',
      },
    });
  });
});