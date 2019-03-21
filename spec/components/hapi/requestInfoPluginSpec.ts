import * as hapi from 'hapi';
import {requestInfoLifeCycleMethod} from '../../../src/components/hapi/requestInfoPlugin';
import {Writeable} from '../../../components/Writeable';

describe('A requestInfoPlugin', () => {
  let requestMock: hapi.Request;
  let hMock: Writeable<hapi.ResponseToolkit>;

  beforeEach(() => {
    requestMock    = {
      path:    'path',
      method:  'GET',
      headers: {},
      query:   {},
      app:     {},
    } as hapi.Request & any;

    hMock          = {} as Writeable<hapi.ResponseToolkit>;
    hMock.continue = Symbol('continue');
  });

  describe('When creating info from a request', () => {
    it('Sets the info on the application state', () => {
      requestInfoLifeCycleMethod(requestMock, hMock);

      expect(requestMock.app.requestInfo).toEqual({
        request: {
          path:    'path',
          method:  'GET',
          headers: {},
          query:   {},
        },
      });
    });
  });
});