import {HTTPRequest} from './HTTPRequest';

export interface HTTPRequestFactory {
  create: (options: any) => HTTPRequest;
}