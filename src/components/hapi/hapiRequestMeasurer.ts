import * as hapi from 'hapi';
import Boom from 'boom';
import {StatsD} from 'hot-shots';

export interface HapiRequestMeasurerOptions {
  statsdClient: StatsD;
}

export const extractStatsDTagsFromRequest = (request: hapi.Request): string[] => {
  let tags: string[] = [];
  const apiVersion = request.path.split('/')[1];
  const response = request.response;

  tags.push(`method:${request.method}`);

  if (apiVersion) {
    tags.push(`apiVersion:${apiVersion}`);
  }

  if (response instanceof Boom) {
    tags.push(`error:${(response as Boom).name}`);
    tags.push(`statusCode:${(response as Boom).output.statusCode}`);
  } else {
    tags.push(`statusCode:${(response as hapi.ResponseObject).statusCode}`);
  }

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
  name: 'hapi-request-measurer',
  register: lifecycleRegistration,
};