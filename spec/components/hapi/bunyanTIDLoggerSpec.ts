import {BunyanHapiTIDLoggerOptions, bunyanTIDLogger, tidErrorHandler} from '../../../src/components/hapi/bunyanTIDLogger';
import * as hapi from 'hapi';
import {loggerMock} from '../../helpers/mocks/loggerMock';

describe('A bunyanTIDLogger', () => {
  const serverMock  = {} as hapi.Server;
  const requestMock = {} as hapi.Request & any;
  const hMock       = {} as hapi.ResponseToolkit & any;

  beforeEach(() => {
    serverMock.ext  = () => void 0;
    requestMock.app = {};
    hMock.continue  = Symbol('continue');
  });

  it('Can register methods', () => {
    bunyanTIDLogger.register(serverMock, {} as BunyanHapiTIDLoggerOptions);
  });

  describe('The tidErrorHandler', () => {
    beforeEach(() => {
      requestMock.app.tid = '12345-sads-234';
    });

    it('Can continues with valid response', () => {
      const result = tidErrorHandler(loggerMock)(requestMock, hMock);

      expect(result).toEqual(hMock.continue);
    });
  });
});