import * as hapi from 'hapi';
import {createRequestErrorLog} from '../../../src/components/hapi/createRequestErrorLog';

describe('A createRequestErrorLog', () => {
  const requestMock = {
    path:    'path',
    method:  'GET',
    headers: {},
    query:   {},
    payload: {},
    app:     {
      requestID: 'requestID',
    },
  } as hapi.Request & any;

  const error       = new Error();

  describe('Creating info from a request and error', () => {
    const logObject = createRequestErrorLog(requestMock, error);

    it('Returns correct log information', () => {
      expect(logObject).toEqual({
        request:    {
          path:    'path',
          method:  'GET',
          headers: {},
          query:   {},
          body:    {},
        },
        request_id: requestMock.app.requestID,
        error:      error,
      });
    });
  });
});