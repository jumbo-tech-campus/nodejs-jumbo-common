import {HTTPRequest, HTTPRequestOptions} from './HTTPRequest';

export interface HTTPRequestFactory {
  create(options: HTTPRequestOptions): HTTPRequest;
}