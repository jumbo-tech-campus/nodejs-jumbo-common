import * as hapi from 'hapi';
import {onRequestNginxRequestIDLifecycleMethod, onResponseNginxRequestIDLifecycleMethod} from '../../../src/components/hapi/nginxRequestIDPlugin';
import Boom from 'boom';

describe('A onRequestNginxRequestIDLifecycleMethod', () => {
  let requestMock: hapi.Request & any;
  let hMock: hapi.ResponseToolkit & any;

  beforeEach(() => {
    requestMock                 = {} as hapi.Request;
    requestMock.headers         = {
      'x-request-id': 'requestID',
    };
    requestMock.app             = {};
    requestMock.app.requestInfo = {};

    hMock          = {} as hapi.ResponseToolkit & any;
    hMock.continue = Symbol('continue');
  });

  describe('When adding request id from a request', () => {
    beforeEach(() => {
      onRequestNginxRequestIDLifecycleMethod(requestMock, hMock);
    });

    it('Sets the request id on the application state', () => {
      expect(requestMock.app.requestID).toEqual('requestID');
    });
  });
});

describe('A onResponseNginxRequestIDLifecycleMethod', () => {
  let requestMock: hapi.Request & any;
  let hMock: hapi.ResponseToolkit & any;

  beforeEach(() => {
    requestMock                 = {} as hapi.Request;
    requestMock.response        = {} as hapi.ResponseObject;
    requestMock.response.header = () => undefined;
    requestMock.app             = {};
    requestMock.app.requestID   = 'requestID';

    hMock          = {} as hapi.ResponseToolkit as any;
    hMock.continue = Symbol('continue');
  });

  describe('No response is set', () => {
    it('Returns h.continue', () => {
      requestMock.response = undefined;

      expect(onResponseNginxRequestIDLifecycleMethod(requestMock, hMock)).toEqual(hMock.continue);
    });
  });

  describe('Response is error', () => {
    beforeEach(() => {
      requestMock.response = Boom.internal();

      onResponseNginxRequestIDLifecycleMethod(requestMock, hMock);
    });

    it('Sets request id as header', () => {
      expect(requestMock.response.output.headers['x-request-id']).toEqual('requestID');
    });
  });

  describe('Response is normal response', () => {
    beforeEach(() => {
      spyOn(requestMock.response, 'header');

      onResponseNginxRequestIDLifecycleMethod(requestMock, hMock);
    });

    it('Sets request id as header', () => {
      expect(requestMock.response.header).toHaveBeenCalledWith('x-request-id', 'requestID');
    });
  });
});