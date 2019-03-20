import * as hapi from 'hapi';
import Boom from 'boom';
import {StatsD} from 'hot-shots';
import {statusCodeToTag} from '../httprequest/statusCodeToTag';

export interface HapiRequestMeasurerOptions {
  statsdClient: StatsD;
}

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

export const statsdTimingLifecycleMethod = (options: HapiRequestMeasurerOptions): hapi.ResponseEventHandler => (request) => {
  options.statsdClient.timing(
    'request.duration',
    Date.now() - request.info.received,
    extractStatsDTagsFromRequest(request));
};

const lifecycleRegistration = (server: hapi.Server, options: HapiRequestMeasurerOptions) => {
  server.events.on('response', statsdTimingLifecycleMethod(options));
};

export const hapiRequestMeasurer: hapi.Plugin<HapiRequestMeasurerOptions> = {
  name:     'hapi-request-measurer',
  register: lifecycleRegistration,
};