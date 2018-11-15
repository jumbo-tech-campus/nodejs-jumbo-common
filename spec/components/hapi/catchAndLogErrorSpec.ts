import {catchAndLogError} from '../../../src/components/hapi/catchAndLogError';
import {loggerMock} from '../../helpers/mocks/loggerMock';
import hapi from 'hapi';
import Boom from 'boom';

describe('A catchAndLogError', () => {
  const requestMock        = {} as hapi.Request;
  const hMock              = {} as hapi.ResponseToolkit;
  const responseObjectMock = {} as hapi.ResponseObject;
  hMock.response           = () => responseObjectMock;
  responseObjectMock.code  = () => responseObjectMock;
  const catchError         = catchAndLogError(loggerMock);

  describe('When succesfully handling a lifecyclemethod', () => {
    let response: any;

    beforeEach(async () => {
      response = await catchError(async (request, h) => h.response().code(200))(requestMock, hMock);
    });

    it('Returns status 200', () => {
      expect(response).toBe(responseObjectMock);
    });
  });

  describe('When handling a rejected Boom error', () => {
    let error: unknown;
    const throwError = Boom.badRequest('You did something stupid');

    beforeEach(async () => {
      try {
        await catchError(async (request, h) => Promise.reject(throwError))(requestMock, hMock);
      } catch (e) {
        error = e;
      }
    });

    it('Throws the boom error', () => {
      expect(error).toBe(throwError);
    });
  });

  describe('When handling a thrown Boom error', () => {
    let error: unknown;
    const throwError = Boom.badRequest('You did something stupid');

    beforeEach(async () => {
      try {
        await catchError(async (request, h) => {
          throw throwError;
        })(requestMock, hMock);
      } catch (e) {
        error = e;
      }
    });

    it('Throws the boom error', () => {
      expect(error).toBe(throwError);
    });
  });

  describe('When handling any other error', () => {
    let error: Boom;
    const throwError = new Error();

    beforeEach(async () => {
      spyOn(loggerMock, 'error');
      try {
        await catchError(async (request, h) => {
          throw throwError;
        })(requestMock, hMock);
      } catch (e) {
        error = e;
      }
    });

    it('Throws an internal server error boom', () => {
      expect(error.output.statusCode).toBe(500);
    });

    it('Expect error to be logged', () => {
      expect(loggerMock.error).toHaveBeenCalled();
    });

    it('Has a transaction ID', () => {
      expect(Object.keys(error.output.headers)).toContain('transaction-id');
    });
  });
});