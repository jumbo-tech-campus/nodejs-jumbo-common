import * as hapi from 'hapi';
import Boom from 'boom';
import {JWTWrapper} from '../JWTWrapper';
import Logger from 'bunyan';

declare module 'hapi' {
  interface ApplicationState {
    jwt: {
      userID?: string;
    };
  }
}

interface JWTHapiPluginOptions {
  jwtHeader: string;
  jwtWrapper: JWTWrapper;
  logger: Logger;
}

export const createJWTUnpacker = (options: JWTHapiPluginOptions): hapi.Lifecycle.Method => (request, h) => {
  request.app.jwt = {};

  const jwtHeaderValue = request.headers[options.jwtHeader];

  if (typeof jwtHeaderValue === 'string') {
    let decodedObject: Record<string, string>;

    try {
      decodedObject = options.jwtWrapper.verify(jwtHeaderValue);
    } catch (error) {
      options.logger.error({
        error: error,
      }, 'Error while decoding JWT');

      throw Boom.unauthorized(`Invalid Authentication Tokens`);
    }

    if (typeof decodedObject === 'object' && decodedObject.CustomerID) {
      request.app.jwt.userID = decodedObject.CustomerID;
    }
  }

  return h.continue;
};

export const jwtHapiPlugin: hapi.Plugin<JWTHapiPluginOptions> = {
  name:     'jwt-plugin',
  register: (server, options) => server.ext('onRequest', createJWTUnpacker(options)),
};