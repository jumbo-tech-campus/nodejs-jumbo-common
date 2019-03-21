import * as hapi from 'hapi';

declare module 'hapi' {
  interface ApplicationState {
    requestInfo: Record<string, unknown>;
  }
}

export const requestInfoLifeCycleMethod: hapi.Lifecycle.Method = (request, h) => {
  request.app.requestInfo = {
    request: {
      path:    request.path,
      method:  request.method,
      headers: request.headers,
      query:   request.query,
    },
  };

  return h.continue;
};

export const requestInfoPlugin: hapi.Plugin<{}> = {
  name:     'hapi-request-log-info',
  register: (server: hapi.Server) => {
    server.ext('onRequest', requestInfoLifeCycleMethod);
  },
};