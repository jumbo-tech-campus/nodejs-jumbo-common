import * as request from 'request';

export type HTTPRequestOptions = request.OptionsWithUrl & {baseUrl: string};

export interface HTTPRequestResponse {
  headers: { [headerName: string]: string | string[] | undefined };
  statusCode: number;
  body: any;
}

export interface HTTPRequest {
  readonly options: HTTPRequestOptions;

  execute(): Promise<HTTPRequestResponse>;
}