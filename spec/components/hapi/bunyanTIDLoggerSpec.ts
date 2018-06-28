import {createTIDLoggerLifecycleMethod, tidErrorHandler} from '../../../src/components/hapi/bunyanTIDLogger';
import * as Logger from 'bunyan';
import * as hapi from 'hapi';
import Boom from 'boom';

describe('A bunyanTIDLogger', () => {
  const requestMock = {} as hapi.Request & any;
  const hMock       = {} as hapi.ResponseToolkit & any;

  beforeEach(() => {
    requestMock.app  = {};
    hMock.continue   = Symbol('continue');
  });

  describe('The tidLoggerLifecycleMethod', () => {
    const loggerMock = {} as Logger;

    beforeEach(() => {
      loggerMock.child = () => loggerMock;
    });

    const tidLoggerLifecycleMethod = createTIDLoggerLifecycleMethod({
      logger: loggerMock,
    });

    it('Adds a logger and tid to the request object', () => {
      const result = tidLoggerLifecycleMethod(requestMock, hMock);

      expect(requestMock.app.logger).toBeDefined();
      expect(requestMock.app.tid).toBeDefined();
      expect(result).toEqual(hMock.continue);
    });
  });

  describe('The tidErrorHandler', () => {
    beforeEach(() => {
      requestMock.app.tid = '12345-sads-234';
    });

    it('Can add tid to response on error', () => {
      requestMock.response = Boom.badRequest('Bad request');

      const result = tidErrorHandler(requestMock, hMock);

      expect(result).toEqual(hMock.continue);
      expect(requestMock.response.output.headers['x-transaction-id']).toEqual('12345-sads-234');
    });

    it('Can continues with valid response', () => {
      const result = tidErrorHandler(requestMock, hMock);

      expect(result).toEqual(hMock.continue);
    });
  });
});