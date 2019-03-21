import * as hapi from 'hapi';
import {Writeable} from '../../../components/Writeable';
import {onRequestNginxRequestIDLifecycleMethod} from '../../../src/components/hapi/nginxRequestIDPlugin';

describe('A onRequestNginxRequestIDLifecycleMethod', () => {
  let requestMock: hapi.Request & any;
  let hMock: Writeable<hapi.ResponseToolkit>;

  beforeEach(() => {
    requestMock                 = {} as hapi.Request;
    requestMock.headers         = {
      'x-request-id': 'requestID',
    };
    requestMock.app             = {};
    requestMock.app.requestInfo = {};

    hMock          = {} as Writeable<hapi.ResponseToolkit>;
    hMock.continue = Symbol('continue');
  });

  describe('When creating info from a request', () => {
    it('Sets the info on the application state', () => {
      onRequestNginxRequestIDLifecycleMethod(requestMock, hMock);

      expect(requestMock.app.requestInfo).toEqual({
        request_id: 'requestID',
      });
      expect(requestMock.app.requestID).toEqual('requestID');
    });
  });
});