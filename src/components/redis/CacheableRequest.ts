export interface CacheableRequest<T> {
  execute: () => Promise<T>;
}