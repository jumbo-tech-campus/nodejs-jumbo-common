import {HTTPRequest} from '../../../src/components/httprequest/HTTPRequest';
import {HTTPRequestMeasurable} from '../../../src/components/httprequest/HTTPRequestMeasurable';

describe('A HTTPRequestMeasurable', () => {
  let request: HTTPRequestMeasurable;
  beforeEach(() => {
    const httpRequestMock = {options: {}} as HTTPRequest;
    request               = new HTTPRequestMeasurable(httpRequestMock);

    httpRequestMock.execute = async () => Promise.resolve({
      statusCode: 200,
      headers:    {},
      body:       {},
    });
  });

  it('Should be able to return tags with statusCode', async () => {
    await request.execute();

    expect(request.tags).toEqual(['statusCode:200']);
  });

  it('Should be able to return tags without statusCode', async () => {
    expect(request.tags).toEqual([]);
  });
});