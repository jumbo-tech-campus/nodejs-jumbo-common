import {HTTPRequestMeasurable} from '../../../src/components/httprequest/HTTPRequestMeasurable';
import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';

describe('A HTTPRequestMeasurable', () => {
  let request: HTTPRequestMeasurable;
  beforeEach(() => {
    const httpRequestMock = {
      options: {
        url: '/v2/products',
      },
    } as HTTPRequest;
    request               = new HTTPRequestMeasurable(httpRequestMock);

    httpRequestMock.execute = () => Promise.resolve({
      statusCode: 200,
      headers:    {},
      body:       {},
    });
  });

  it('Should be able to return tags with statusCode', async () => {
    await request.execute();

    expect(request.tags).toContain('statuscode:200');
    expect(request.tags).toContain('url:/v2/products');
    expect(request.tags).toContain('method:get');
    expect(request.tags).toContain('result:success');
  });

  it('Should be able to return tags without statusCode', async () => {
    expect(request.tags).toEqual(['url:/v2/products', 'method:get', 'result:failed']);
  });
});