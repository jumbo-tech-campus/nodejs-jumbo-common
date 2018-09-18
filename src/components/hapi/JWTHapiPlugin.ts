import * as hapi from 'hapi';
import {verify} from 'jsonwebtoken';
import Boom from 'boom';
import {JWTWrapper} from '../jwt/JWTWrapper';

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
}

export const createJWTUnpacker = (options: JWTHapiPluginOptions): hapi.Lifecycle.Method => (request, h) => {
  request.app.jwt = {};

  const jwtHeaderValue = request.headers[options.jwtHeader];

  if (typeof jwtHeaderValue === 'string') {
    let decodedObject: Record<string, string>;

    try {
      decodedObject = options.jwtWrapper.verify(jwtHeaderValue);
    } catch (error) {
      request.app.logger.error({
        error: error,
      }, 'Error while decoding JWT');

      throw Boom.badRequest(`Invalid JWT Token for header ${options.jwtHeader}`);
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