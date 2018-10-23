import * as request from 'request';
import {HTTPRequest} from './HTTPRequest';
import {HTTPRequestFactory} from './HTTPRequestFactory';
import {RequestJSWrapper} from './RequestJSWrapper';

export class RequestJSWrapperFactory implements HTTPRequestFactory {
  public create(options: request.Options): HTTPRequest {
    return new RequestJSWrapper(options);
  }
}