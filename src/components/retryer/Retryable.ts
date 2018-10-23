export interface Retryable {
  attempt(): Promise<boolean>;

  getLogInformation(): object;
}