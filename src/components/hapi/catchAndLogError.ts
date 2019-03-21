import hapi from 'hapi';
import Boom from 'boom';
import Logger from 'bunyan';
import {createRequestErrorLog} from './createRequestErrorLog';

export const catchAndLogError = (logger: Logger) => (lifecycleMethod: hapi.Lifecycle.Method): hapi.Lifecycle.Method => async (request, h) => {
  try {
    return await lifecycleMethod(request, h);
  } catch (error) {
    logger.error(createRequestErrorLog(request, error), 'Error in route');

    if (!Boom.isBoom(error)) {
      error = Boom.internal();
    }

    throw error;
  }
};