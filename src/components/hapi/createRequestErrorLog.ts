import * as hapi from 'hapi';

export const createRequestErrorLog = (request: hapi.Request, error: Error): Record<string, unknown> => ({
  request:    {
    path:    request.path,
    method:  request.method,
    headers: request.headers,
    query:   request.query,
  },
  request_id: request.app.requestID,
  error:      error,
});
