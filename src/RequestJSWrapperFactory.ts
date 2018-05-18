import {HTTPRequest} from './HTTPRequest';
import {RequestJSWrapper} from './RequestJSWrapper';
import * as request from 'request';
import {HTTPRequestFactory} from './HTTPRequestFactory';

export class RequestJSWrapperFactory implements HTTPRequestFactory {
  public create(options: request.Options): HTTPRequest {
    return new RequestJSWrapper(options);
  }
}