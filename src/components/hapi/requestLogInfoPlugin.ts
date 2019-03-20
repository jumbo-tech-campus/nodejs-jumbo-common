import * as hapi from 'hapi';

declare module 'hapi' {
  interface ApplicationState {
    requestLogInfo: Record<string, unknown>;
  }
}

export const requestLogInfoPlugin: hapi.Plugin<{}> = {
  name:     'hapi-request-log-info',
  register: (server: hapi.Server, options: {}) => {
    server.ext('onRequest', (request, h) => {
      request.app.requestLogInfo = {
        request: {
          path:    request.path,
          method:  request.method,
          headers: request.headers,
          query:   request.query,
          payload: request.payload,
        },
      };

      if (request.app.requestID) {
        request.app.requestLogInfo.request_id = request.app.requestID;
      }

      return h.continue;
    });
  },
};