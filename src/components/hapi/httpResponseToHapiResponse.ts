import * as hapi from 'hapi';
import {HTTPResponse} from '../httprequest/HTTPResponse';

export const httpResponseToHapiResponse = (response: HTTPResponse, h: hapi.ResponseToolkit) => {
  let responseObject = h.response(response.body).code(response.statusCode);

  if (response.headers) {
    for (let header of Object.keys(response.headers)) {
      responseObject = responseObject.header(header, response.headers[header]);
    }
  }

  return responseObject;
};