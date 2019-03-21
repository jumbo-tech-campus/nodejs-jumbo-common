import * as hapi from 'hapi';
import {Writeable} from '../../../components/Writeable';
import {onRequestNginxRequestIDLifecycleMethod, onResponseNginxRequestIDLifecycleMethod} from '../../../src/components/hapi/nginxRequestIDPlugin';
import Boom from 'boom';

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

  describe('When adding request id from a request', () => {
    beforeEach(() => {
      onRequestNginxRequestIDLifecycleMethod(requestMock, hMock);
    });

    it('Sets the request id on the application state', () => {
      expect(requestMock.app.requestID).toEqual('requestID');
    });

    it('Sets the request id on the request info', () => {
      expect(requestMock.app.requestInfo).toEqual({
        request_id: 'requestID',
      });
    });
  });
});

describe('A onResponseNginxRequestIDLifecycleMethod', () => {
  let requestMock: hapi.Request & any;
  let hMock: Writeable<hapi.ResponseToolkit>;

  beforeEach(() => {
    requestMock               = {} as hapi.Request;
    requestMock.response      = {} as hapi.ResponseObject;
    requestMock.app           = {};
    requestMock.app.requestID = 'requestID';

    hMock          = {} as Writeable<hapi.ResponseToolkit>;
    hMock.continue = Symbol('continue');
  });

  describe('When no response is set', () => {
    it('Returns h.continue', () => {
      requestMock.response = undefined;

      expect(onResponseNginxRequestIDLifecycleMethod(requestMock, hMock)).toEqual(hMock.continue);
    });
  });

  describe('When response is error', () => {
    beforeEach(() => {
      requestMock.response = Boom.internal();

      onResponseNginxRequestIDLifecycleMethod(requestMock, hMock);
    });

    it('Sets request id as header', () => {
      expect(requestMock.response.output.headers['x-request-id']).toEqual('requestID');
    });
  });
});