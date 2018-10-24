import nock from 'nock';
import {OptionsWithUrl} from 'request';
import {asyncIt} from '../../helpers/JasmineHelper';
import {RequestJSWrapper} from '../../../src/components/httprequest/RequestJSWrapper';
import {HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';

describe('A RequestJSWrapper', () => {
  let domain  = 'http://mobileapi.unit-test-jumbo.com';
  let url     = 'v2/test/url';
  let nockUrl = '/' + url;
  let options = {
    url: `${domain}/${url}`,
  } as OptionsWithUrl;

  asyncIt('Can return a valid HTTPResponse', async () => {
    nock(domain).get(nockUrl).reply(200, {}, {});

    let response = await new RequestJSWrapper(options).execute() as HTTPRequestResponse;

    expect(response.body).toEqual('{}');
    expect(response.headers).toEqual({'content-type': 'application/json'});
  });

  asyncIt('Can return a valid HTTPResponse with JSON body', async () => {
    nock(domain).get(nockUrl).reply(200, {}, {});

    let response = await new RequestJSWrapper({
      ...options,
      json: true,
    }).execute() as HTTPRequestResponse;

    expect(response.body).toEqual({});
    expect(response.headers).toEqual({'content-type': 'application/json'});
  });

  asyncIt('Can return a 4** valid HTTPResponse with JSON body', async () => {
    nock(domain).get(nockUrl).reply(400, {}, {});

    let response = await new RequestJSWrapper({
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
      expect(error.name).toEqual('HTTPRequestError');
      expect(error.message).toEqual('ESOCKETTIMEDOUT');

      return;
    }

    fail();
  });

  asyncIt('Can return an invalid HTTPResponse with ETIMEDOUT', async () => {
    nock(domain).get(nockUrl).replyWithError('ETIMEDOUT');

    try {
      await new RequestJSWrapper(options).execute();
    } catch (error) {
      expect(error.name).toEqual('HTTPRequestTimedoutError');
      expect(error.message).toEqual('Request timed out');

      return;
    }

    fail();
  });

  asyncIt('Can return an invalid HTTPResponse with CUSTOM error', async () => {
    nock(domain).get(nockUrl).replyWithError('CUSTOM');

    try {
      await new RequestJSWrapper(options).execute();
    } catch (error) {
      expect(error.name).toEqual('HTTPRequestError');
      expect(error.message).toEqual('CUSTOM');

      return;
    }

    fail();
  });

  asyncIt('Can use a baseURL', async () => {
    nock(domain).get(nockUrl).reply(200, {}, {});

    let result = await new RequestJSWrapper({
      baseUrl: domain,
      url: '/' + url,
    }).execute();

    expect(result).toEqual({
      statusCode: 200,
      body: '{}',
      headers: {
        'content-type': 'application/json',
      },
    });
  });
});