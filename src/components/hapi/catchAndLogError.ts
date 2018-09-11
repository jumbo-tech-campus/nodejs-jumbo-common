import hapi from 'hapi';
import Boom from 'boom';

export const catchUnhandledError = (lifecycleMethod: hapi.Lifecycle.Method): hapi.Lifecycle.Method => async (request, h) => {
  try {
    return await lifecycleMethod(request, h);
  } catch (error) {
    if (!Boom.isBoom(error)) {
      request.app.logger.error({
        request: {
          path:    request.path,
          method:  request.method,
          headers: request.headers,
          query:   request.query,
          payload: request.payload,
        },
        error:   error,
      }, 'Unhandled error in route');
    }

    throw error;
  }
};