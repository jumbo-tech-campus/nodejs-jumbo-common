import * as hapi from 'hapi';
import {createRequestErrorLog} from '../../../src/components/hapi/createRequestErrorLog';

describe('A createRequestErrorLog', () => {
  let requestMock: hapi.Request;
  const error = new Error();

  beforeEach(() => {
    requestMock = {
      path:    'path',
      method:  'GET',
      headers: {},
      query:   {},
      app:     {
        requestID: 'requestID',
      },
    } as hapi.Request & any;
  });

  describe('When creating info from a request', () => {
    it('Returns correct log information', () => {
      expect(createRequestErrorLog(requestMock, error)).toEqual({
        request:    {
          path:    'path',
          method:  'GET',
          headers: {},
          query:   {},
          body:    undefined,
        },
        request_id: requestMock.app.requestID,
        error:      error,
      });
    });
  });
});