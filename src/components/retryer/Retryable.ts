export interface Retryable {
  attempt: () => Promise<boolean>;
}