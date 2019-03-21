import * as hapi from 'hapi';
import {createRequestLogInfo} from '../../../src/components/hapi/createRequestLogInfo';

describe('A createRequestLogInfo', () => {
  let requestMock: hapi.Request;

  beforeEach(() => {
    requestMock = {
      path:    'path',
      method:  'GET',
      headers: {},
      query:   {},
      app:     {},
    } as hapi.Request & any;
  });

  describe('When creating info from a request', () => {
    it('Returns correct log information', () => {
      const logInfo = createRequestLogInfo(requestMock);

      expect(logInfo).toEqual({
        path:    'path',
        method:  'GET',
        headers: {},
        query:   {},
      });
    });
  });
});