import hapi from 'hapi';
import Boom from 'boom';
import Logger from 'bunyan';
import uuidv4 from 'uuid/v4';

export const catchUnhandledError = (logger: Logger) => (lifecycleMethod: hapi.Lifecycle.Method): hapi.Lifecycle.Method => async (request, h) => {
  try {
    return await lifecycleMethod(request, h);
  } catch (error) {
    if (!Boom.isBoom(error)) {
      const tid = uuidv4();

      logger.error({
        tid:     tid,
        request: {
          path:    request.path,
          method:  request.method,
          headers: request.headers,
          query:   request.query,
          payload: request.payload,
        },
        error:   error,
      }, 'Error in route');

      error = Boom.internal();
      error.output.headers['transaction-id'] = tid;
    }

    throw error;
  }
};