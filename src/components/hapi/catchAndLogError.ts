import hapi from 'hapi';
import Boom from 'boom';
import Logger from 'bunyan';
import uuidv4 from 'uuid/v4';

export const catchAndLogError = (logger: Logger) => (lifecycleMethod: hapi.Lifecycle.Method): hapi.Lifecycle.Method => async (request, h) => {
  try {
    return await lifecycleMethod(request, h);
  } catch (error) {
    if (!Boom.isBoom(error)) {
      const tid = uuidv4();

      const logObject: Record<string, unknown> = {
        tid:     tid,
        request: {
          path:    request.path,
          method:  request.method,
          headers: request.headers,
          query:   request.query,
          payload: request.payload,
        },
        error:   error,
      };

      error = Boom.internal();

      if (request.app.requestID) {
        logObject.request_id = request.app.requestID;
        error.output.headers['x-request-id'] = tid;
      }

      logger.error(logObject, 'Error in route');
    }

    throw error;
  }
};