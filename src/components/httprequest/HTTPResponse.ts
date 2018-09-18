export interface HTTPResponse {
  statusCode: number;
  body?: object;
  headers?: Record<string, string>;
}