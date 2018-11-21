import * as hapi from 'hapi';
import {StatsD} from 'hot-shots';
import {statuscodeToResultTag} from '../statuscodeToResultTag';

export interface HapiRequestMeasurerOptions {
  statsdClient: StatsD;
}

export const extractStatsDTagsFromRequest = (request: hapi.Request): string[] => {
  let tags: string[] = [];
  const apiVersion   = request.path.split('/')[1];
  const response     = request.response;

  tags.push(`method:${request.method}`);
  tags.push(`path:${request.route.path}`);

  if (apiVersion) {
    tags.push(`apiversion:${apiVersion}`);
  }

  if (!response) {
    return tags.concat('result:failed');
  }

  let statusCode: number;

  if (response instanceof Error) {
    tags.push(`error:${response.name}`);
    statusCode = response.output.statusCode;
  } else {
    statusCode = response.statusCode;
  }

  tags.push(`statuscode:${statusCode}`);
  tags.push(`result:${statuscodeToResultTag(statusCode)}`);

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