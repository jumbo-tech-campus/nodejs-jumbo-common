import * as hapi from 'hapi';

declare module 'hapi' {
  interface ApplicationState {
    requestID: string | undefined;
  }
}

export const onRequestNginxRequestIDLifecycleMethod: hapi.Lifecycle.Method = (request, h) => {
  request.app.requestID = request.headers['x-request-id'];

  if (request.app.requestInfo && request.app.requestID) {
    request.app.requestInfo.request_id = request.app.requestID;
  }

  return h.continue;
};

export const onResponseNginxRequestIDLifecycleMethod: hapi.Lifecycle.Method = (request, h) => {
  if (!request.response) {
    return h.continue;
  }

  if (request.response instanceof Error) {
    if (request.app.requestID) {
      request.response.output.headers['x-request-id'] = request.app.requestID;
    }

    return h.continue;
  }

  if (request.app.requestID) {
    request.response.header('x-request-id', request.app.requestID);
  }

  return h.continue;
};

export const nginxRequestIDPlugin: hapi.Plugin<{}> = {
  name:     'hapi-nginx-request-id-plugin',
  register: (server: hapi.Server, options: {}) => {
    server.ext('onRequest', onRequestNginxRequestIDLifecycleMethod);

    server.ext('onPreResponse', onResponseNginxRequestIDLifecycleMethod);
  },
};