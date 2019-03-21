import * as hapi from 'hapi';

declare module 'hapi' {
  interface ApplicationState {
    requestInfo: Record<string, unknown>;
  }
}

export const requestInfoPlugin: hapi.Plugin<{}> = {
  name:     'hapi-request-log-info',
  register: (server: hapi.Server) => {
    server.ext('onRequest', (request, h) => {
      request.app.requestInfo = {
        request: {
          path:    request.path,
          method:  request.method,
          headers: request.headers,
          query:   request.query,
          payload: request.payload,
        },
      };

      if (request.app.requestID) {
        request.app.requestInfo.request_id = request.app.requestID;
      }

      return h.continue;
    });
  },
};