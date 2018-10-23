import hapi from 'hapi';
import {httpResponseToHapiResponse} from '../../../src/components/hapi/httpResponseToHapiResponse';
import {HTTPResponse} from '../../../src/components/httprequest/HTTPResponse';

describe('A httpResponseToHapiResponse', () => {
  const hMock    = {} as hapi.ResponseToolkit & any;
  hMock.response = () => hMock;
  hMock.code     = () => hMock;
  hMock.header   = () => hMock;

  it('Can convert to a HTTPResponse', () => {
    spyOn(hMock, 'response').and.callThrough();
    spyOn(hMock, 'code').and.callThrough();
    spyOn(hMock, 'header').and.callThrough();

    const httpResponse: HTTPResponse = {
      statusCode: 200,
      body:       {},
      headers:    {
        location: 'location'
      }
    };

    httpResponseToHapiResponse(httpResponse, hMock);

    expect(hMock.response).toHaveBeenCalledWith(httpResponse.body);
    expect(hMock.code).toHaveBeenCalledWith(httpResponse.statusCode);
    expect(hMock.header).toHaveBeenCalled();
  });

  it('Can convert to a HTTPResponse without headers', () => {
    spyOn(hMock, 'response').and.callThrough();
    spyOn(hMock, 'code').and.callThrough();
    spyOn(hMock, 'header').and.callThrough();

    const httpResponse: HTTPResponse = {
      statusCode: 200,
      body:       {}
    };

    httpResponseToHapiResponse(httpResponse, hMock);

    expect(hMock.response).toHaveBeenCalledWith(httpResponse.body);
    expect(hMock.code).toHaveBeenCalledWith(httpResponse.statusCode);
    expect(hMock.header).not.toHaveBeenCalled();
  });
});