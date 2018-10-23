import * as request from 'request';

export type HTTPRequestOptions = request.Options;

export interface HTTPRequestResponse {
  headers: { [headerName: string]: string | string[] | undefined };
  statusCode: number;
  body: unknown;
}

export interface HTTPRequest {
  readonly options: HTTPRequestOptions;

  execute(): Promise<HTTPRequestResponse>;
}