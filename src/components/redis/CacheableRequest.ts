export interface CacheableRequest<T> {
  cacheKey: string;
  execute: () => Promise<T>;
}