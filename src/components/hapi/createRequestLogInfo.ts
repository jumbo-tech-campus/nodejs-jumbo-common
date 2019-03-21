import * as hapi from 'hapi';

export const createRequestLogInfo = (request: hapi.Request): Record<string, unknown> => ({
  path:    request.path,
  method:  request.method,
  headers: request.headers,
  query:   request.query,
});
