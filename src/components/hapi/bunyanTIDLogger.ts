import * as hapi from 'hapi';
import uuidv4 from 'uuid/v4';
import * as Logger from 'bunyan';

declare module 'hapi' {
  interface Request {
    tid: string;
    logger: Logger;
  }
}

interface BunyanHapiTIDLoggerOptions {
  logger: Logger;

}

export const bunyanTIDLogger: hapi.Plugin<BunyanHapiTIDLoggerOptions> = {
  name:     'bunyanTIDLogger',
  register: (server, options) => {
    server.ext('onRequest', (request, h) => {
      request.tid    = uuidv4();
      request.logger = options.logger.child({
        transactionID: request.tid,
      });

      return h.continue;
    });

    server.ext('onPostHandler', (request, h) => {
      const response = request.response;

      if (response && 'isBoom' in response && response.isBoom) {
        response.output.headers['x-transaction-id'] = request.tid;
      }

      return h.continue;
    });
  },
};