import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';
import {RequestJSWrapper} from './RequestJSWrapper';
import {HTTPRequestFactory} from './HTTPRequestFactory';

export class RequestJSWrapperFactory implements HTTPRequestFactory {
  public create(options: HTTPRequestOptions): HTTPRequest {
    return new RequestJSWrapper(options);
  }
}