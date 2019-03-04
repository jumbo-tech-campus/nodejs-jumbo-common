export interface CacheQuery<T> {
  execute: () => Promise<T>;
}