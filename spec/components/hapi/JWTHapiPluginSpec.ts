import * as hapi from 'hapi';
import {sign} from 'jsonwebtoken';
import {createJWTUnpacker} from '../../../src/components/hapi/JWTHapiPlugin';
import {JWTWrapper} from '../../../src/components/jwt/JWTWrapper';
import {loggerMock} from '../../helpers/mocks/loggerMock';

describe('A Hapi JumboTokenPlugin', () => {
  const jwtWrapperMock          = {} as JWTWrapper;
  const unpackerLifecycleMethod = createJWTUnpacker({
    jwtHeader:  'x-jumbo-token',
    jwtWrapper: jwtWrapperMock
  });
  const requestMock             = {} as hapi.Request & any;
  const hMock                   = {} as hapi.ResponseToolkit & any;

  beforeEach(() => {
    requestMock.app     = {
      logger: loggerMock
    };
    requestMock.headers = {
      'x-jumbo-token': sign({
        CustomerID: 'customerID'
      },                    'supersecret')
    };
    hMock.continue      = Symbol('continue');
    jwtWrapperMock.verify = () => ({
      CustomerID: 'customerID'
    });
  });

  it('Should be able to decode a jwt token', () => {
    const result = unpackerLifecycleMethod(requestMock, hMock);

    expect(result).toEqual(hMock.continue);
    expect(requestMock.app.jwt.userID).toEqual('customerID');
  });

  it('Should be able to handle no jwt token', () => {
    requestMock.headers = {};

    const result = unpackerLifecycleMethod(requestMock, hMock);

    expect(result).toEqual(hMock.continue);
    expect(requestMock.app.jwt.userID).not.toBeDefined();
  });

  it('Should be able to handle a jwt token without a customerID', () => {
    jwtWrapperMock.verify = () => ({});

    const result = unpackerLifecycleMethod(requestMock, hMock);

    expect(result).toEqual(hMock.continue);
    expect(requestMock.app.jwt.userID).not.toBeDefined();
  });

  it('Should be able to handle an invalid jwt token', () => {
    const error = new Error();

    jwtWrapperMock.verify = () => {
      throw error;
    };

    try {
      unpackerLifecycleMethod(requestMock, hMock);
    } catch (error) {
      expect(error.message).toEqual('Invalid JWT Token for header x-jumbo-token');

      return;
    }

    fail('Should throw an error');
  });
});