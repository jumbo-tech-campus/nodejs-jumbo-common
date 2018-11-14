import * as hapi from 'hapi';
import uuidv4 from 'uuid/v4';
import * as Logger from 'bunyan';
import Boom from 'boom';

declare module 'hapi' {
  interface ApplicationState {
    logger: Logger;
  }
}

export interface BunyanHapiTIDLoggerOptions {
  logger: Logger;
}

export const tidErrorHandler: (logger: Logger) => hapi.Lifecycle.Method = (logger) => (request, h) => {
  const response = request.response;

  if (response instanceof Error && Boom.isBoom(response) && response.isServer) {
    const tid = uuidv4();

    response.output.headers['x-transaction-id'] = tid;

    logger.error({
      tid:     tid,
      request: {
        path:    request.path,
        method:  request.method,
        headers: request.headers,
        query:   request.query,
        payload: request.payload,
      },
      error:   response,
      boom:    response.isBoom,
    }, 'Error in request');
  }

  return h.continue;
};

export const bunyanTIDLogger: hapi.Plugin<BunyanHapiTIDLoggerOptions> = {
  name:     'logging',
  register: (server, options) => {
    server.ext('onPreResponse', tidErrorHandler(options.logger));
  },
};