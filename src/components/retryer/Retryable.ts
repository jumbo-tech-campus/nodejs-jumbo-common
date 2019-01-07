export interface Retryable {
  tags: string[];

  attempt: () => Promise<boolean>;
  getLogInformation: () => object;
}