import hapi from 'hapi';
import Boom from 'boom';
import Logger from 'bunyan';

export const catchAndLogError = (logger: Logger) => (lifecycleMethod: hapi.Lifecycle.Method): hapi.Lifecycle.Method => async (request, h) => {
  try {
    return await lifecycleMethod(request, h);
  } catch (error) {
    const logObject: Record<string, unknown> = {
      request: {
        path:    request.path,
        method:  request.method,
        headers: request.headers,
        query:   request.query,
        payload: request.payload,
      },
      error:   error,
    };

    if (request.app.requestID) {
      logObject.request_id = request.app.requestID;
    }

    logger.error(logObject, 'Error in route');

    if (!Boom.isBoom(error)) {
      error = Boom.internal();
    }

    throw error;
  }
};