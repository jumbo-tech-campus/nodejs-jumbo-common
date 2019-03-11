import * as hapi from 'hapi';
import Boom from 'boom';
import {StatsD} from 'hot-shots';

export interface HapiRequestMeasurerOptions {
  statsdClient: StatsD;
}

export const statusCodeToTag = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'Success';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'Redirection';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'Client Error';
  } else {
    return 'Server Error';
  }
};

export const extractStatsDTagsFromRequest = (request: hapi.Request): string[] => {
  const tags: string[] = [];
  const apiVersion     = request.path.split('/')[1];
  const response       = request.response;

  tags.push(`method:${request.method}`);
  tags.push(`path:${request.route.path}`);

  if (apiVersion) {
    tags.push(`apiVersion:${apiVersion}`);
  }

  let statusCode: number | undefined;

  if (response instanceof Boom) {
    tags.push(`error:${response.name}`);
    statusCode = response.output.statusCode;
  } else {
    statusCode = (response as hapi.ResponseObject).statusCode;
  }

  tags.push(`statusCode:${statusCode}`);
  tags.push(`result:${statusCodeToTag(statusCode)}`);

  return tags;
};

export const statsdTimingLifecycleMethod = (options: HapiRequestMeasurerOptions): hapi.Lifecycle.Method => (request, h) => {
  options.statsdClient.timing(
    'request.duration',
    Date.now() - request.info.received,
    extractStatsDTagsFromRequest(request));

  return h.continue;
};

const lifecycleRegistration = (server: hapi.Server, options: HapiRequestMeasurerOptions) => {
  server.ext('onPreResponse', statsdTimingLifecycleMethod(options));
};

export const hapiRequestMeasurer: hapi.Plugin<HapiRequestMeasurerOptions> = {
  name:     'hapi-request-measurer',
  register: lifecycleRegistration,
};